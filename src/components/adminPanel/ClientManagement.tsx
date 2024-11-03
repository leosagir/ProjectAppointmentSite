import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { 
  fetchClients, 
  updateClient, 
  deactivateClient,
  reactivateClient,
  selectAllClients,
  selectClientsStatus,
  selectClientsError
} from '../../store/slices/clientSlice';
import {
  fetchAppointments,
  bookAppointment,
  cancelBooking,
  selectAllAppointments,
  selectAppointmentsStatus,
  selectAppointmentsError
} from '../../store/slices/appointmentsSlice';
import { ClientResponseDto, ClientUpdateDto, ClientRequestDto } from '../../types/client';
import { NotificationResponseDto } from '../../types/notification';
import { AppointmentResponseDto, AppointmentBookDto } from '../../types/appointment';
import { SpecializationResponseDto } from '../../types/specialization';
import { SpecialistResponseDto } from '../../types/specialists';
import { adminApi } from '../../api/adminApi';
import { publicApi } from '../../api/publicApi';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tab,
  Tabs,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { AppointmentStatus } from '../../types/enum';

const ClientManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const clients = useSelector(selectAllClients);
  const clientsStatus = useSelector(selectClientsStatus);
  const clientsError = useSelector(selectClientsError);
  const appointments = useSelector(selectAllAppointments);
  const appointmentsStatus = useSelector(selectAppointmentsStatus);
  const appointmentsError = useSelector(selectAppointmentsError);

  const [selectedClient, setSelectedClient] = useState<ClientResponseDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<string>('');
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [clientForm, setClientForm] = useState<ClientRequestDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    phone: ''
  });
  const [activeTab, setActiveTab] = useState(0);
  const [clientAppointments, setClientAppointments] = useState<AppointmentResponseDto[]>([]);
  const [clientNotifications, setClientNotifications] = useState<NotificationResponseDto[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [availableAppointments, setAvailableAppointments] = useState<AppointmentResponseDto[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponseDto | null>(null);
  const [specializations, setSpecializations] = useState<SpecializationResponseDto[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<number | null>(null);
  const [specialists, setSpecialists] = useState<SpecialistResponseDto[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<number | null>(null);

  useEffect(() => {
    if (clientsStatus === 'idle') {
      dispatch(fetchClients());
    }
    if (appointmentsStatus === 'idle') {
      dispatch(fetchAppointments());
    }
    fetchSpecializations();
  }, [clientsStatus, appointmentsStatus, dispatch]);

  const fetchSpecializations = async () => {
    try {
      const response = await adminApi.getAllSpecializations();
      setSpecializations(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der Spezialisierungen:', error);
      setSnackbar({ open: true, message: 'Fehler beim Laden der Spezialisierungen', severity: 'error' });
    }
  };

  useEffect(() => {
    if (selectedSpecialization) {
      fetchSpecialists();
    }
  }, [selectedSpecialization]);

  const fetchSpecialists = async () => {
    try {
      const response = await adminApi.getAllSpecialists();
      const filteredSpecialists = response.data.filter(
        specialist => specialist.specializations.some(spec => spec.id === selectedSpecialization)
      );
      setSpecialists(filteredSpecialists);
    } catch (error) {
      console.error('Fehler beim Laden der Spezialisten:', error);
      setSnackbar({ open: true, message: 'Fehler beim Laden der Spezialisten', severity: 'error' });
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredClients = clients.filter(client => 
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientSelect = async (client: ClientResponseDto) => {
    setSelectedClient(client);
    setActiveTab(0);
    try {
      const clientAppointments = appointments.filter(app => 
        app.clientId === client.id
      );
      setClientAppointments(clientAppointments);
      const notifications = await adminApi.getClientNotifications(client.id);
      setClientNotifications(notifications.data);
    } catch (error) {
      console.error('Fehler beim Laden der Kundendaten:', error);
      setSnackbar({ open: true, message: 'Fehler beim Laden der Kundendaten', severity: 'error' });
    }
  };

  const handleCreateClient = () => {
    setDialogMode('create');
    setClientForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      address: '',
      phone: ''
    });
    setIsClientDialogOpen(true);
  };

  const handleEditClient = () => {
    if (selectedClient) {
      setDialogMode('edit');
      setClientForm({
        email: selectedClient.email,
        password: '',
        firstName: selectedClient.firstName,
        lastName: selectedClient.lastName,
        dateOfBirth: selectedClient.dateOfBirth,
        address: selectedClient.address,
        phone: selectedClient.phone
      });
      setIsClientDialogOpen(true);
    }
  };

  const handleClientFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientForm({
      ...clientForm,
      [event.target.name]: event.target.value
    });
  };

  const handleClientFormSubmit = async () => {
    setIsClientDialogOpen(false);
    setConfirmationAction(dialogMode === 'create' ? 'createClient' : 'updateClient');
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    setIsConfirmationDialogOpen(false);
    try {
      switch (confirmationAction) {
        case 'createClient':
          await publicApi.registerClient(clientForm);
          dispatch(fetchClients());
          setSnackbar({ open: true, message: 'Kunde erfolgreich erstellt', severity: 'success' });
          break;
        case 'updateClient':
          if (selectedClient) {
            const updateData: ClientUpdateDto = {
              firstName: clientForm.firstName,
              lastName: clientForm.lastName,
              dateOfBirth: clientForm.dateOfBirth,
              address: clientForm.address,
              phone: clientForm.phone
            };
            await dispatch(updateClient({ id: selectedClient.id, data: updateData }));
            setSnackbar({ open: true, message: 'Kundendaten aktualisiert', severity: 'success' });
          }
          break;
        case 'deactivateClient':
          if (selectedClient) {
            await dispatch(deactivateClient(selectedClient.id));
            setSnackbar({ open: true, message: 'Kunde deaktiviert', severity: 'success' });
          }
          break;
        case 'reactivateClient':
          if (selectedClient) {
            await dispatch(reactivateClient(selectedClient.id));
            setSnackbar({ open: true, message: 'Kunde aktiviert', severity: 'success' });
          }
          break;
        case 'bookAppointment':
          if (selectedAppointment && selectedClient) {
            const bookingData: AppointmentBookDto = {
              clientId: selectedClient.id
            };
            await dispatch(bookAppointment({ id: selectedAppointment.id, data: bookingData }));
            setIsAppointmentDialogOpen(false);
            dispatch(fetchAppointments());
            setSnackbar({ open: true, message: 'Termin erfolgreich gebucht', severity: 'success' });
          }
          break;
        case 'cancelAppointment':
          if (selectedAppointment) {
            await dispatch(cancelBooking(selectedAppointment.id));
            dispatch(fetchAppointments());
            setSnackbar({ open: true, message: 'Termin storniert', severity: 'success' });
          }
          break;
      }
    } catch (error) {
      console.error('Fehler bei der Ausführung der Aktion:', error);
      setSnackbar({ open: true, message: 'Fehler bei der Ausführung der Aktion', severity: 'error' });
    }
  };

  const handleDeactivateClient = () => {
    setConfirmationAction('deactivateClient');
    setIsConfirmationDialogOpen(true);
  };

  const handleReactivateClient = () => {
    setConfirmationAction('reactivateClient');
    setIsConfirmationDialogOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreateAppointment = async () => {
    setSelectedSpecialization(null);
    setSelectedSpecialist(null);
    setAvailableAppointments([]);
    setIsAppointmentDialogOpen(true);
  };

  const handleSpecializationChange = (event: SelectChangeEvent<number>) => {
    setSelectedSpecialization(event.target.value as number);
    setSelectedSpecialist(null);
    setAvailableAppointments([]);
  };

  const handleSpecialistChange = async (event: SelectChangeEvent<number>) => {
    const specialistId = event.target.value as number;
    setSelectedSpecialist(specialistId);
    try {
      const availableAppointments = appointments.filter(
        app => app.appointmentStatus === AppointmentStatus.AVAILABLE && 
               app.specialistId === specialistId
      );
      setAvailableAppointments(availableAppointments);
    } catch (error) {
      console.error('Fehler beim Laden der verfügbaren Termine:', error);
      setSnackbar({ open: true, message: 'Fehler beim Laden der verfügbaren Termine', severity: 'error' });
    }
  };

  const handleAppointmentSelect = (appointment: AppointmentResponseDto) => {
    setSelectedAppointment(appointment);
    setConfirmationAction('bookAppointment');
    setIsConfirmationDialogOpen(true);
  };

  const handleCancelAppointment = (appointment: AppointmentResponseDto) => {
    setSelectedAppointment(appointment);
    setConfirmationAction('cancelAppointment');
    setIsConfirmationDialogOpen(true);
  };

  if (clientsStatus === 'loading' || appointmentsStatus === 'loading') {
    return <CircularProgress />;
  }

  if (clientsStatus === 'failed' || appointmentsStatus === 'failed') {
    return <Typography color="error">{clientsError || appointmentsError}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Linke Seitenleiste mit Kundenliste */}
      <Paper sx={{ width: 300, overflow: 'auto', p: 2 }}>
        <Typography variant="h6" gutterBottom>Kunden</Typography>
        <TextField
          label="Kunde suchen"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateClient} 
          fullWidth 
          sx={{ mt: 2, mb: 2 }}
        >
          Neuen Kunden erstellen
        </Button>
        <List>
          {filteredClients.map((client) => (
            <ListItemButton
              key={client.id}
              selected={selectedClient?.id === client.id}
              onClick={() => handleClientSelect(client)}
            >
              <ListItemText primary={`${client.lastName} ${client.firstName}`} />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      {/* Hauptinhaltsbereich */}
      <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
        {selectedClient ? (
          <>
            <Typography variant="h5" gutterBottom>{`${selectedClient.lastName} ${selectedClient.firstName}`}</Typography>
            <Button variant="outlined" onClick={handleEditClient} sx={{ mr: 1 }}>Bearbeiten</Button>
            {selectedClient.status === 'ACTIVE' ? (
              <Button variant="outlined" color="error" onClick={handleDeactivateClient}>Deaktivieren</Button>
            ) : (
              <Button variant="outlined" color="success" onClick={handleReactivateClient}>Aktivieren</Button>
            )}
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mt: 2, mb: 2 }}>
              <Tab label="Informationen" />
              <Tab label="Termine" />
              <Tab label="Benachrichtigungen" />
            </Tabs>
            {activeTab === 0 && (
              <Box>
                <Typography>E-Mail: {selectedClient.email}</Typography>
                <Typography>Geburtsdatum: {selectedClient.dateOfBirth}</Typography>
                <Typography>Adresse: {selectedClient.address}</Typography>
                <Typography>Telefon: {selectedClient.phone}</Typography>
                <Typography>Status: {selectedClient.status}</Typography>
              </Box>
            )}
            {activeTab === 1 && (
    <Box>
      <Typography variant="h6" gutterBottom>Termine</Typography>
      {clientAppointments.length > 0 ? (
        clientAppointments.map((appointment) => (
          <Paper key={appointment.id} sx={{ p: 2, mb: 2 }}>
            <Typography>{`Datum: ${new Date(appointment.startTime).toLocaleString()}`}</Typography>
            <Typography>{`Dienstleistung: ${appointment.serviceName || 'Nicht angegeben'}`}</Typography>
            <Typography>{`Spezialist: ${appointment.specialistName || 'Nicht angegeben'}`}</Typography>
            <Typography>{`Status: ${appointment.appointmentStatus}`}</Typography>
            {appointment.appointmentStatus === AppointmentStatus.BOOKED && (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => handleCancelAppointment(appointment)}
                sx={{ mt: 1 }}
              >
                Termin stornieren
              </Button>
            )}
          </Paper>
        ))
      ) : (
        <Typography>Der Kunde hat keine Termine</Typography>
      )}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleCreateAppointment}
        sx={{ mt: 2 }}
      >
        Termin buchen
      </Button>
    </Box>
  )}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>Benachrichtigungen</Typography>
                {clientNotifications.length > 0 ? (
                  clientNotifications.map((notification) => (
                    <Paper key={notification.id} sx={{ p: 2, mb: 2 }}>
                      <Typography>{`Datum: ${new Date(notification.sentAt).toLocaleString()}`}</Typography>
                      <Typography>{`Status: ${notification.status}`}</Typography>
                      <Typography>{`Termin: ${notification.appointmentId}`}</Typography>
                      <Typography>{`Nachricht: ${notification.message}`}</Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography>Der Kunde hat keine Benachrichtigungen</Typography>
                )}
              </Box>
            )}
          </>
        ) : (
          <Typography>Bitte wählen Sie einen Kunden aus der Liste</Typography>
        )}
      </Box>

      {/* Dialoge */}
      <Dialog open={isClientDialogOpen} onClose={() => setIsClientDialogOpen(false)}>
        <DialogTitle>{dialogMode === 'create' ? 'Neuen Kunden erstellen' : 'Kunden bearbeiten'}</DialogTitle>
        <DialogContent>
          {dialogMode === 'create' && (
            <>
              <TextField
                name="email"
                label="E-Mail"
                fullWidth
                margin="normal"
                value={clientForm.email}
                onChange={handleClientFormChange}
              />
              <TextField
                name="password"
                label="Passwort"
                type="password"
                fullWidth
                margin="normal"
                value={clientForm.password}
                onChange={handleClientFormChange}
              />
            </>
          )}
          <TextField
            name="firstName"
            label="Vorname"
            fullWidth
            margin="normal"
            value={clientForm.firstName}
            onChange={handleClientFormChange}
          />
          <TextField
            name="lastName"
            label="Nachname"
            fullWidth
            margin="normal"
            value={clientForm.lastName}
            onChange={handleClientFormChange}
          />
          <TextField
            name="dateOfBirth"
            label="Geburtsdatum"
            type="date"
            fullWidth
            margin="normal"
            value={clientForm.dateOfBirth}
            onChange={handleClientFormChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="address"
            label="Adresse"
            fullWidth
            margin="normal"
            value={clientForm.address}
            onChange={handleClientFormChange}
          />
          <TextField
            name="phone"
            label="Telefon"
            fullWidth
            margin="normal"
            value={clientForm.phone}
            onChange={handleClientFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsClientDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleClientFormSubmit} color="primary">
            {dialogMode === 'create' ? 'Erstellen' : 'Speichern'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAppointmentDialogOpen} onClose={() => setIsAppointmentDialogOpen(false)}>
        <DialogTitle>Termin buchen</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Spezialisierung</InputLabel>
            <Select
              value={selectedSpecialization || ''}
              onChange={handleSpecializationChange}
            >
              {specializations.map((spec) => (
                <MenuItem key={spec.id} value={spec.id}>{spec.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedSpecialization && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Spezialist</InputLabel>
              <Select
                value={selectedSpecialist || ''}
                onChange={handleSpecialistChange}
              >
                {specialists.map((spec) => (
                  <MenuItem key={spec.id} value={spec.id}>{`${spec.lastName} ${spec.firstName}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {selectedSpecialist && (
            <List>
              {availableAppointments.map((appointment) => (
                <ListItemButton 
                  key={appointment.id}
                  onClick={() => handleAppointmentSelect(appointment)}
                >
                  <ListItemText 
                    primary={`Spezialist: ${appointment.specialistName || 'Nicht angegeben'}`}
                    secondary={`Datum: ${new Date(appointment.startTime).toLocaleString()} - ${new Date(appointment.endTime).toLocaleString()}`}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAppointmentDialogOpen(false)}>Abbrechen</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isConfirmationDialogOpen} onClose={() => setIsConfirmationDialogOpen(false)}>
        <DialogTitle>Aktion bestätigen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmationAction === 'createClient' && 'Sind Sie sicher, dass Sie einen neuen Kunden erstellen möchten?'}
            {confirmationAction === 'updateClient' && 'Sind Sie sicher, dass Sie die Kundendaten aktualisieren möchten?'}
            {confirmationAction === 'deactivateClient' && 'Sind Sie sicher, dass Sie den Kunden deaktivieren möchten?'}
            {confirmationAction === 'reactivateClient' && 'Sind Sie sicher, dass Sie den Kunden aktivieren möchten?'}
            {confirmationAction === 'bookAppointment' && 'Bestätigen Sie die Terminbuchung?'}
            {confirmationAction === 'cancelAppointment' && 'Sind Sie sicher, dass Sie den Termin stornieren möchten?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmationDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleConfirmAction} color="primary">Bestätigen</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientManagement;