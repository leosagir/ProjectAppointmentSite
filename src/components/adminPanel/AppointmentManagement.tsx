import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import {
  fetchAppointments,
  createAppointment,
  deleteAppointment,
  selectAllAppointments,
  selectAppointmentsStatus,
  selectAppointmentsError,
  cancelBooking
} from '../../store/slices/appointmentsSlice';
import { fetchSpecialists, selectAllSpecialists } from '../../store/slices/specialistSlice';
import { fetchServices, selectAllServices } from '../../store/slices/servicesSlice';
import { fetchSpecializations, selectAllSpecializations } from '../../store/slices/specializationsSlice';
import { AppointmentResponseDto, AppointmentCreateDto } from '../../types/appointment';
import { AppointmentStatus } from '../../types/enum';
import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
  Grid,
  Snackbar,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const AppointmentManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appointments = useSelector(selectAllAppointments);
  const specialists = useSelector(selectAllSpecialists);
  const services = useSelector(selectAllServices);
  const specializations = useSelector(selectAllSpecializations);
  const status = useSelector(selectAppointmentsStatus);
  const error = useSelector(selectAppointmentsError);

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCancelBookingDialogOpen, setIsCancelBookingDialogOpen] = useState(false);
  const [isBulkCreateDialogOpen, setIsBulkCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AppointmentCreateDto>({
    specialistId: 0,
    startTime: '',
    endTime: '',
  });
  const [bulkCreateData, setBulkCreateData] = useState({
    specialistId: 0,
    startDate: new Date(),
    endDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    breakStartTime: new Date(),
    breakEndTime: new Date(),
    appointmentDuration: 60,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<number | ''>('');
  const [selectedSpecializationId, setSelectedSpecializationId] = useState<number | ''>('');
  

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchSpecialists());
    dispatch(fetchServices());
    dispatch(fetchSpecializations());
  }, [dispatch]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const specialistMatch = selectedSpecialistId === '' || appointment.specialistId === selectedSpecialistId;
      const specializationMatch = selectedSpecializationId === '' || 
        specialists.find(s => s.id === appointment.specialistId)?.specializations.some(
          spec => spec.id === (selectedSpecializationId as number)
        );
      return specialistMatch && specializationMatch;
    });
  }, [appointments, selectedSpecialistId, selectedSpecializationId, specialists]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'specialistId' ? Number(value) : value
    }));
  };

  const handleBulkInputChange = (name: string, value: any) => {
    setBulkCreateData({ ...bulkCreateData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createAppointment(formData)).unwrap();
      setSnackbar({ open: true, message: 'Termin erfolgreich erstellt', severity: 'success' });
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Termin konnte nicht gespeichert werden', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (selectedAppointment && selectedAppointment.appointmentStatus === AppointmentStatus.AVAILABLE) {
      try {
        await dispatch(deleteAppointment(selectedAppointment.id)).unwrap();
        setSnackbar({ 
          open: true, 
          message: 'Termin erfolgreich gelöscht', 
          severity: 'success' 
        });
        setIsDeleteDialogOpen(false);
        handleCloseDialog();
      } catch (err: any) {
        console.error('Fehler beim Löschen des Termins:', err);
        setSnackbar({ 
          open: true, 
          message: `Termin konnte nicht gelöscht werden. ${err.message || err}`, 
          severity: 'error' 
        });
      }
    }
  };

  const handleCancelBooking = async () => {
    if (selectedAppointment && selectedAppointment.appointmentStatus === AppointmentStatus.BOOKED) {
      try {
        await dispatch(cancelBooking(selectedAppointment.id)).unwrap();
        setSnackbar({ 
          open: true, 
          message: 'Buchung erfolgreich storniert', 
          severity: 'success' 
        });
        setIsCancelBookingDialogOpen(false);
        handleCloseDialog();
      } catch (err) {
        console.error('Fehler beim Stornieren der Buchung:', err);
        setSnackbar({ 
          open: true, 
          message: `Buchung konnte nicht storniert werden. ${err}`, 
          severity: 'error' 
        });
      }
    }
  };

  const handleOpenDialog = (appointment?: AppointmentResponseDto) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      if (appointment.appointmentStatus === AppointmentStatus.AVAILABLE) {
        setIsDeleteDialogOpen(true);
      } else if (appointment.appointmentStatus === AppointmentStatus.BOOKED) {
        setIsCancelBookingDialogOpen(true);
      }
    } else {
      setSelectedAppointment(null);
      setFormData({
        specialistId: 0,
        startTime: '',
        endTime: '',
      });
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setIsCancelBookingDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleBulkCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { specialistId, startDate, endDate, startTime, endTime, breakStartTime, breakEndTime, appointmentDuration } = bulkCreateData;
    let currentDate = new Date(startDate);
    const endDateValue = new Date(endDate);
  
    while (currentDate <= endDateValue) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { 
        let currentStartTime = setMinutes(setHours(currentDate, startTime.getHours()), startTime.getMinutes());
        const dayEndTime = setMinutes(setHours(currentDate, endTime.getHours()), endTime.getMinutes());
        const breakStart = setMinutes(setHours(currentDate, breakStartTime.getHours()), breakStartTime.getMinutes());
        const breakEnd = setMinutes(setHours(currentDate, breakEndTime.getHours()), breakEndTime.getMinutes());
  
        while (currentStartTime < dayEndTime) {
          if (currentStartTime < breakStart || currentStartTime >= breakEnd) {
            const endTimeSlot = new Date(currentStartTime.getTime() + appointmentDuration * 60000);
            if (endTimeSlot <= dayEndTime && !(currentStartTime < breakEnd && endTimeSlot > breakStart)) {
              try {
                await dispatch(createAppointment({
                  specialistId,
                  startTime: format(currentStartTime, "yyyy-MM-dd'T'HH:mm:ss"),
                  endTime: format(endTimeSlot, "yyyy-MM-dd'T'HH:mm:ss"),
                })).unwrap();
              } catch (error) {
                console.error('Fehler beim Erstellen des Termins:', error);
              }
            }
          }
          currentStartTime = new Date(currentStartTime.getTime() + appointmentDuration * 60000);
        }
      }
      currentDate = addDays(currentDate, 1);
    }
    setSnackbar({ open: true, message: 'Massenanlage von Terminen abgeschlossen', severity: 'success' });
    setIsBulkCreateDialogOpen(false);
  };

  const getSpecialistName = (specialistId: number) => {
    const specialist = specialists.find(s => s.id === specialistId);
    return specialist ? `${specialist.firstName} ${specialist.lastName}` : 'Spezialist nicht angegeben';
  };

  const getServiceName = (serviceId: number | null) => {
    if (serviceId === null) return null;
    const service = services.find(s => s.id === serviceId);
    return service ? service.title : 'Leistung nicht angegeben';
  };

  const formatEventTitle = (appointment: AppointmentResponseDto) => {
    const specialistName = getSpecialistName(appointment.specialistId);
    const serviceName = getServiceName(appointment.serviceId);
    
    if (appointment.appointmentStatus === AppointmentStatus.AVAILABLE) {
      return `Verfügbar - ${specialistName}`;
    } else {
      return `Gebucht - ${specialistName} - ${serviceName} - Patient: ${appointment.clientName || 'Nicht angegeben'}`;
    }
  };

  const events = filteredAppointments.map(appointment => ({
    id: appointment.id,
    title: formatEventTitle(appointment),
    start: new Date(appointment.startTime),
    end: new Date(appointment.endTime),
    status: appointment.appointmentStatus,
    resource: appointment,
  }));

  const eventStyleGetter = (event: any) => {
    const isBooked = event.status === AppointmentStatus.BOOKED;
    const style = {
      backgroundColor: isBooked ? '#f44336' : '#2196f3', 
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style: style
    };
  };

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return (
      <Alert severity="error">
        Fehler: {error}
        <Button color="inherit" size="small" onClick={() => dispatch(fetchAppointments())}>
          Erneut versuchen
        </Button>
      </Alert>
    );
  } 

  const minTime = new Date();
  minTime.setHours(7, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(19, 0, 0);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper style={{ padding: '20px', margin: '20px auto' }}>
        <Typography variant="h4" gutterBottom>Terminverwaltung</Typography>
        <Grid container spacing={2} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              fullWidth
            >
              Neuen Termin hinzufügen
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => setIsBulkCreateDialogOpen(true)}
              fullWidth
            >
              Massenanlage von Terminen
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Filter nach Spezialist</InputLabel>
              <Select
                value={selectedSpecialistId}
                onChange={(e) => setSelectedSpecialistId(e.target.value as number | '')}
              >
                <MenuItem value="">Alle Spezialisten</MenuItem>
                {specialists.map((specialist) => (
                  <MenuItem key={specialist.id} value={specialist.id}>{specialist.lastName} {specialist.firstName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Filter nach Spezialisierung</InputLabel>
              <Select
                value={selectedSpecializationId}
                onChange={(e) => setSelectedSpecializationId(e.target.value as number | '')}
              >
                <MenuItem value="">Alle Spezialisierungen</MenuItem>
                {specializations.map((specialization) => (
                  <MenuItem key={specialization.id} value={specialization.id}>{specialization.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '500px' }}
          onSelectEvent={(event) => handleOpenDialog(event.resource)}
          selectable
          onSelectSlot={(slotInfo) => handleOpenDialog({
            id: 0,
            specialistId: 0,
            specialistName: '',
            clientId: 0,
            clientName: '',
            serviceId: 0,
            serviceName: '',
            startTime: slotInfo.start.toISOString(),
            endTime: slotInfo.end.toISOString(),
            appointmentStatus: AppointmentStatus.AVAILABLE
          })}
          eventPropGetter={eventStyleGetter}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.MONTH}
          min={minTime}
          max={maxTime}
          scrollToTime={minTime}
        />

        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Neuen Termin erstellen</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Spezialist</InputLabel>
                    <Select
                      name="specialistId"
                      value={String(formData.specialistId)}
                      onChange={handleInputChange}
                      required
                    >
                      {specialists.map((specialist) => (
                        <MenuItem key={specialist.id} value={String(specialist.id)}>
                          {specialist.lastName} {specialist.firstName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Startzeit"
                    name="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Endzeit"
                    name="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Abbrechen</Button>
              <Button type="submit" color="primary">
                Erstellen
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogTitle>Termin löschen bestätigen</DialogTitle>
          <DialogContent>
            <Typography>Sind Sie sicher, dass Sie diesen Termin löschen möchten?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleDelete} color="error">Löschen</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isCancelBookingDialogOpen} onClose={() => setIsCancelBookingDialogOpen(false)}>
          <DialogTitle>Buchung stornieren bestätigen</DialogTitle>
          <DialogContent>
            <Typography>Sind Sie sicher, dass Sie diese Buchung stornieren möchten?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCancelBookingDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleCancelBooking} color="error">Buchung stornieren</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isBulkCreateDialogOpen} onClose={() => setIsBulkCreateDialogOpen(false)}>
          <DialogTitle>Massenanlage von Terminen</DialogTitle>
          <form onSubmit={handleBulkCreate}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Spezialist</InputLabel>
                    <Select
                      value={bulkCreateData.specialistId}
                      onChange={(e) => handleBulkInputChange('specialistId', e.target.value)}
                      required
                    >
                      {specialists.map((specialist) => (
                        <MenuItem key={specialist.id} value={specialist.id}>
                          {specialist.lastName} {specialist.firstName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label="Startdatum"
                    value={bulkCreateData.startDate}
                    onChange={(date) => handleBulkInputChange('startDate', date)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label="Enddatum"
                    value={bulkCreateData.endDate}
                    onChange={(date) => handleBulkInputChange('endDate', date)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TimePicker
                    label="Arbeitsbeginn"
                    value={bulkCreateData.startTime}
                    onChange={(time) => handleBulkInputChange('startTime', time)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TimePicker
                    label="Arbeitsende"
                    value={bulkCreateData.endTime}
                    onChange={(time) => handleBulkInputChange('endTime', time)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TimePicker
                    label="Pausenbeginn"
                    value={bulkCreateData.breakStartTime}
                    onChange={(time) => handleBulkInputChange('breakStartTime', time)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TimePicker
                    label="Pausenende"
                    value={bulkCreateData.breakEndTime}
                    onChange={(time) => handleBulkInputChange('breakEndTime', time)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Termindauer (Minuten)"
                    type="number"
                    value={bulkCreateData.appointmentDuration}
                    onChange={(e) => handleBulkInputChange('appointmentDuration', parseInt(e.target.value))}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsBulkCreateDialogOpen(false)}>Abbrechen</Button>
              <Button type="submit" color="primary">
                Termine erstellen
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </LocalizationProvider>
  );
};

export default AppointmentManagement;