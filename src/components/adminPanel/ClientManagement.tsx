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
  const status = useSelector(selectClientsStatus);
  const error = useSelector(selectClientsError);

  const [selectedClient, setSelectedClient] = useState<ClientResponseDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
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
    if (status === 'idle') {
      dispatch(fetchClients());
    }
    fetchSpecializations();
  }, [status, dispatch]);

  const fetchSpecializations = async () => {
    try {
      const response = await adminApi.getAllSpecializations();
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке специализаций', severity: 'error' });
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
      console.error('Error fetching specialists:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке специалистов', severity: 'error' });
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
      const appointments = await adminApi.getAllAppointments();
      const notifications = await adminApi.getAllNotifications();
      setClientAppointments(appointments.data.filter(app => 
        app.clientId === client.id &&
        app.appointmentStatus === AppointmentStatus.BOOKED
      ));
      setClientNotifications(notifications.data.filter(notif => notif.clientId === client.id));
    } catch (error) {
      console.error('Error fetching client data:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке данных клиента', severity: 'error' });
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
    try {
      if (dialogMode === 'create') {
        await publicApi.registerClient(clientForm);
        dispatch(fetchClients());
        setSnackbar({ open: true, message: 'Клиент успешно создан', severity: 'success' });
      } else if (dialogMode === 'edit' && selectedClient) {
        const updateData: ClientUpdateDto = {
          firstName: clientForm.firstName,
          lastName: clientForm.lastName,
          dateOfBirth: clientForm.dateOfBirth,
          address: clientForm.address,
          phone: clientForm.phone
        };
        await dispatch(updateClient({ id: selectedClient.id, data: updateData }));
        setSnackbar({ open: true, message: 'Данные клиента обновлены', severity: 'success' });
      }
      setIsClientDialogOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({ open: true, message: 'Ошибка при сохранении данных клиента', severity: 'error' });
    }
  };

  const handleDeactivateClient = async () => {
    if (selectedClient) {
      try {
        await dispatch(deactivateClient(selectedClient.id));
        setSnackbar({ open: true, message: 'Клиент деактивирован', severity: 'success' });
      } catch (error) {
        console.error('Error deactivating client:', error);
        setSnackbar({ open: true, message: 'Ошибка при деактивации клиента', severity: 'error' });
      }
    }
  };

  const handleReactivateClient = async () => {
    if (selectedClient) {
      try {
        await dispatch(reactivateClient(selectedClient.id));
        setSnackbar({ open: true, message: 'Клиент активирован', severity: 'success' });
      } catch (error) {
        console.error('Error reactivating client:', error);
        setSnackbar({ open: true, message: 'Ошибка при активации клиента', severity: 'error' });
      }
    }
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
      const response = await adminApi.getAllAppointments();
      const availableAppointments = response.data.filter(
        app => app.appointmentStatus === AppointmentStatus.AVAILABLE && 
               app.specialistId === specialistId
      );
      setAvailableAppointments(availableAppointments);
    } catch (error) {
      console.error('Error fetching available appointments:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке доступных записей', severity: 'error' });
    }
  };

  const handleAppointmentSelect = (appointment: AppointmentResponseDto) => {
    setSelectedAppointment(appointment);
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (selectedAppointment && selectedClient) {
      try {
        const bookingData: AppointmentBookDto = {
          clientId: selectedClient.id
        };
        await adminApi.bookAppointment(selectedAppointment.id, bookingData);
        setIsConfirmationDialogOpen(false);
        setIsAppointmentDialogOpen(false);
        const appointments = await adminApi.getAllAppointments();
        setClientAppointments(appointments.data.filter(
          app => app.clientName === `${selectedClient.lastName} ${selectedClient.firstName}` &&
                 app.appointmentStatus === AppointmentStatus.BOOKED
        ));
        setSnackbar({ open: true, message: 'Запись успешно забронирована', severity: 'success' });
      } catch (error) {
        console.error('Error confirming booking:', error);
        setSnackbar({ open: true, message: 'Ошибка при подтверждении бронирования', severity: 'error' });
      }
    }
  };

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Left sidebar with client list */}
      <Paper sx={{ width: 300, overflow: 'auto', p: 2 }}>
        <Typography variant="h6" gutterBottom>Клиенты</Typography>
        <TextField
          label="Поиск клиента"
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
          Создать клиента
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

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
        {selectedClient ? (
          <>
            <Typography variant="h5" gutterBottom>{`${selectedClient.lastName} ${selectedClient.firstName}`}</Typography>
            <Button variant="outlined" onClick={handleEditClient} sx={{ mr: 1 }}>Редактировать</Button>
            {selectedClient.status === 'ACTIVE' ? (
              <Button variant="outlined" color="error" onClick={handleDeactivateClient}>Деактивировать</Button>
            ) : (
              <Button variant="outlined" color="success" onClick={handleReactivateClient}>Активировать</Button>
            )}
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mt: 2, mb: 2 }}>
              <Tab label="Информация" />
              <Tab label="Записи" />
              <Tab label="Уведомления" />
            </Tabs>
            {activeTab === 0 && (
              <Box>
                <Typography>Email: {selectedClient.email}</Typography>
                <Typography>Дата рождения: {selectedClient.dateOfBirth}</Typography>
                <Typography>Адрес: {selectedClient.address}</Typography>
                <Typography>Телефон: {selectedClient.phone}</Typography>
              </Box>
            )}
            {activeTab === 1 && (
      <Box>
        <Typography variant="h6" gutterBottom>Записи</Typography>
        {clientAppointments.length > 0 ? (
          clientAppointments.map((appointment) => (
            <Paper key={appointment.id} sx={{ p: 2, mb: 2 }}>
              <Typography>{`Дата: ${new Date(appointment.startTime).toLocaleString()}`}</Typography>
              <Typography>{`Услуга: ${appointment.serviceName || 'Не указана'}`}</Typography>
              <Typography>{`Специалист: ${appointment.specialistName || 'Не указан'}`}</Typography>
              <Typography>{`Статус: ${appointment.appointmentStatus === AppointmentStatus.BOOKED ? 'Забронировано' : 'Свободно'}`}</Typography>
            </Paper>
          ))
        ) : (
          <Typography>У клиента нет записей</Typography>
        )}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateAppointment}
          sx={{ mt: 2 }}
        >
          Забронировать запись
        </Button>
      </Box>
    )}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>Уведомления</Typography>
                {clientNotifications.length > 0 ? (
                  clientNotifications.map((notification) => (
                    <Paper key={notification.id} sx={{ p: 2, mb: 2 }}>
                      <Typography>{`Дата: ${new Date(notification.sentAt).toLocaleString()}`}</Typography>
                      <Typography>{`Статус: ${notification.status}`}</Typography>
                      <Typography>{`Запись: ${notification.appointmentId}`}</Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography>У клиента нет уведомлений</Typography>
                )}
              </Box>
            )}
          </>
        ) : (
          <Typography>Выберите клиента из списка</Typography>
        )}
      </Box>

      {/* Dialogs */}
      <Dialog open={isClientDialogOpen} onClose={() => setIsClientDialogOpen(false)}>
        <DialogTitle>{dialogMode === 'create' ? 'Создать клиента' : 'Редактировать клиента'}</DialogTitle>
        <DialogContent>
          {dialogMode === 'create' && (
            <>
              <TextField
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                value={clientForm.email}
                onChange={handleClientFormChange}
              />
              <TextField
                name="password"
                label="Пароль"
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
            label="Имя"
            fullWidth
            margin="normal"
            value={clientForm.firstName}
            onChange={handleClientFormChange}
          />
          <TextField
            name="lastName"
            label="Фамилия"
            fullWidth
            margin="normal"
            value={clientForm.lastName}
            onChange={handleClientFormChange}
          />
          <TextField
            name="dateOfBirth"
            label="Дата рождения"
            type="date"
            fullWidth
            margin="normal"
            value={clientForm.dateOfBirth}
            onChange={handleClientFormChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="address"
            label="Адрес"
            fullWidth
            margin="normal"
            value={clientForm.address}
            onChange={handleClientFormChange}
          />
          <TextField
            name="phone"
            label="Телефон"
            fullWidth
            margin="normal"
            value={clientForm.phone}
            onChange={handleClientFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsClientDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleClientFormSubmit} color="primary">
            {dialogMode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAppointmentDialogOpen} onClose={() => setIsAppointmentDialogOpen(false)}>
        <DialogTitle>Забронировать запись</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Специализация</InputLabel>
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
              <InputLabel>Специалист</InputLabel>
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
                    primary={`Специалист: ${appointment.specialistName || 'Не указан'}`}
                    secondary={`Дата: ${new Date(appointment.startTime).toLocaleString()} - ${new Date(appointment.endTime).toLocaleString()}`}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAppointmentDialogOpen(false)}>Отмена</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isConfirmationDialogOpen} onClose={() => setIsConfirmationDialogOpen(false)}>
        <DialogTitle>Подтверждение бронирования</DialogTitle>
        <DialogContent>
          <Typography>
            Вы подтверждаете бронирование записи:
            {selectedAppointment && (
              <>
                <br />
                Специалист: {selectedAppointment.specialistName || 'Не указан'}
                <br />
                Дата: {new Date(selectedAppointment.startTime).toLocaleString()}
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmationDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleConfirmBooking} color="primary">Подтвердить</Button>
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


