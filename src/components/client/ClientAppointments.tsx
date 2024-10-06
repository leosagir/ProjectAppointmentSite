import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchClientAppointments, 
  selectAppointmentsStatus, 
  selectAppointmentsError,
  cancelClientAppointment,
  bookAppointment,
  fetchFreeAppointments,
  selectFreeAppointments
} from '../../store/slices/appointmentsSlice';
import { fetchSpecialists, selectAllSpecialists } from '../../store/slices/specialistSlice';
import { fetchSpecializations, selectAllSpecializations } from '../../store/slices/specializationsSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Box, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { AppointmentResponseDto, AppointmentStatus } from '../../types/appointment';

const ClientAppointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const clientAppointments = useSelector((state: RootState) => state.appointments.clientAppointments);
  const freeAppointments = useSelector(selectFreeAppointments);
  const status = useSelector(selectAppointmentsStatus);
  const error = useSelector(selectAppointmentsError);
  const specialists = useSelector(selectAllSpecialists);
  const specializations = useSelector(selectAllSpecializations);

  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedSpecialization, setSelectedSpecialization] = useState<number | ''>('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<number | ''>('');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponseDto | null>(null);

  useEffect(() => {
    dispatch(fetchClientAppointments());
    dispatch(fetchSpecialists());
    dispatch(fetchSpecializations());
  }, [dispatch]);

  const filteredFreeAppointments = useMemo(() => {
    const now = new Date();
    return freeAppointments.filter(app => new Date(app.startTime) > now);
  }, [freeAppointments]);

  const filteredSpecialists = useMemo(() => {
    if (selectedSpecialization === '') {
      return specialists;
    }
    return specialists.filter(specialist => 
      specialist.specializations.some(spec => spec.id === selectedSpecialization)
    );
  }, [specialists, selectedSpecialization]);

  const handleCancelAppointment = (appointmentId: number) => {
    dispatch(cancelClientAppointment(appointmentId));
  };

  const handleBookAppointment = async () => {
    if (selectedAppointment) {
      try {
        await dispatch(bookAppointment({ id: selectedAppointment.id, data: { clientId: 0 } })).unwrap();
        setIsBookingDialogOpen(false);
        dispatch(fetchClientAppointments());
      } catch (error) {
        console.error('Failed to book appointment:', error);
      }
    }
  };

  const canCancelAppointment = (appointment: AppointmentResponseDto) => {
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    return appointmentTime > now;
  };

  const handleOpenBookingDialog = () => {
    setIsBookingDialogOpen(true);
    setBookingStep(0);
    setSelectedSpecialization('');
    setSelectedSpecialist('');
    setSelectedAppointment(null);
  };

  const handleSpecializationSelect = (specializationId: number) => {
    setSelectedSpecialization(specializationId);
    setBookingStep(1);
  };

  const handleSpecialistSelect = (specialistId: number) => {
    setSelectedSpecialist(specialistId);
    dispatch(fetchFreeAppointments(specialistId));
    setBookingStep(2);
  };

  const handleAppointmentSelect = (appointment: AppointmentResponseDto) => {
    setSelectedAppointment(appointment);
    setBookingStep(3);
  };

  const renderBookingDialog = () => {
    switch (bookingStep) {
      case 0:
        return (
          <>
            <DialogTitle>Выберите способ записи</DialogTitle>
            <DialogContent>
              <Button onClick={() => setBookingStep(1)}>Выбрать специалиста</Button>
              <Button onClick={() => setBookingStep(4)}>Выбрать специализацию</Button>
            </DialogContent>
          </>
        );
      case 1:
        return (
          <>
            <DialogTitle>Выберите специалиста</DialogTitle>
            <DialogContent>
              <FormControl fullWidth>
                <Select
                  value={selectedSpecialist}
                  onChange={(e) => handleSpecialistSelect(e.target.value as number)}
                >
                  {filteredSpecialists.map((spec) => (
                    <MenuItem key={spec.id} value={spec.id}>{spec.firstName} {spec.lastName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
          </>
        );
      case 2:
        return (
          <>
            <DialogTitle>Выберите время</DialogTitle>
            <DialogContent>
              {filteredFreeAppointments.length > 0 ? (
                filteredFreeAppointments.map((app: AppointmentResponseDto) => (
                  <Button 
                    key={app.id} 
                    onClick={() => handleAppointmentSelect(app)}
                  >
                    {new Date(app.startTime).toLocaleString()}
                  </Button>
                ))
              ) : (
                <Typography>В ближайшее время свободные записи отсутствуют</Typography>
              )}
            </DialogContent>
          </>
        );
      case 3:
        return (
          <>
            <DialogTitle>Подтвердите запись</DialogTitle>
            <DialogContent>
              {selectedAppointment && (
                <>
                  <Typography>Специалист: {selectedAppointment.specialistName}</Typography>
                  <Typography>Начало: {new Date(selectedAppointment.startTime).toLocaleString()}</Typography>
                  <Typography>Окончание: {new Date(selectedAppointment.endTime).toLocaleString()}</Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsBookingDialogOpen(false)}>Отмена</Button>
              <Button onClick={handleBookAppointment} color="primary">Подтвердить</Button>
            </DialogActions>
          </>
        );
      case 4:
        return (
          <>
            <DialogTitle>Выберите специализацию</DialogTitle>
            <DialogContent>
              <FormControl fullWidth>
                <Select
                  value={selectedSpecialization}
                  onChange={(e) => handleSpecializationSelect(e.target.value as number)}
                >
                  {specializations.map((spec) => (
                    <MenuItem key={spec.id} value={spec.id}>{spec.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
          </>
        );
      default:
        return null;
    }
  };

  if (status === 'loading') {
    return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  }

  if (status === 'failed') {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Мои записи</Typography>
      
      <Button variant="contained" color="primary" onClick={handleOpenBookingDialog}>
        Забронировать новую запись
      </Button>

      {clientAppointments.map((appointment: AppointmentResponseDto) => (
        <Box key={appointment.id} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography>Начало: {new Date(appointment.startTime).toLocaleString()}</Typography>
          <Typography>Окончание: {new Date(appointment.endTime).toLocaleString()}</Typography>
          <Typography>Специалист: {appointment.specialistName}</Typography>
          <Typography>Статус: {appointment.appointmentStatus}</Typography>
          {canCancelAppointment(appointment) && (
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => handleCancelAppointment(appointment.id)}
              sx={{ mt: 1 }}
            >
              Отменить запись
            </Button>
          )}
        </Box>
      ))}

      <Dialog open={isBookingDialogOpen} onClose={() => setIsBookingDialogOpen(false)}>
        {renderBookingDialog()}
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => dispatch({ type: 'appointments/clearError' })}>
        <Alert onClose={() => dispatch({ type: 'appointments/clearError' })} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientAppointments;