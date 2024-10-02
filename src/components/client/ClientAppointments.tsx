import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { clientApi } from '../../api/clientApi';
import { AppointmentResponseDto, AppointmentBookDto } from '../../types/appointment';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';

const ClientAppointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [availableAppointments, setAvailableAppointments] = useState<AppointmentResponseDto[]>([]);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await clientApi.getClientAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке записей', severity: 'error' });
    }
  };

  const handleOpenBookingDialog = async () => {
    try {
      // Здесь должен быть API-вызов для получения доступных записей
      // const response = await clientApi.getAvailableAppointments();
      // setAvailableAppointments(response.data);
      setIsBookingDialogOpen(true);
    } catch (error) {
      console.error('Error fetching available appointments:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке доступных записей', severity: 'error' });
    }
  };

  const handleBookAppointment = async (appointmentId: number) => {
    try {
      const bookingData: AppointmentBookDto = { clientId: 0 }; // clientId должен быть установлен на бэкенде
      await clientApi.bookAppointment(appointmentId, bookingData);
      setIsBookingDialogOpen(false);
      fetchAppointments();
      setSnackbar({ open: true, message: 'Запись успешно забронирована', severity: 'success' });
    } catch (error) {
      console.error('Error booking appointment:', error);
      setSnackbar({ open: true, message: 'Ошибка при бронировании записи', severity: 'error' });
    }
  };

  const renderAppointmentList = (title: string, appointmentList: AppointmentResponseDto[]) => (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <List>
        {appointmentList.map((appointment) => (
          <ListItem key={appointment.id}>
            <ListItemText
              primary={`${new Date(appointment.startTime).toLocaleString()} - ${new Date(appointment.endTime).toLocaleString()}`}
              secondary={`Специалист: ${appointment.specialistName}, Услуга: ${appointment.serviceName}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const now = new Date();
  const pastAppointments = appointments.filter(app => new Date(app.endTime) < now);
  const upcomingAppointments = appointments.filter(app => new Date(app.startTime) >= now);

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpenBookingDialog}>
        Забронировать новую запись
      </Button>

      {renderAppointmentList('Предстоящие записи', upcomingAppointments)}
      {renderAppointmentList('Прошедшие записи', pastAppointments)}

      <Dialog open={isBookingDialogOpen} onClose={() => setIsBookingDialogOpen(false)}>
        <DialogTitle>Доступные записи</DialogTitle>
        <DialogContent>
          <List>
            {availableAppointments.map((appointment) => (
              <ListItem key={appointment.id}>
                <ListItemText
                  primary={`${new Date(appointment.startTime).toLocaleString()} - ${new Date(appointment.endTime).toLocaleString()}`}
                  secondary={`Специалист: ${appointment.specialistName}, Услуга: ${appointment.serviceName}`}
                />
                <Button onClick={() => handleBookAppointment(appointment.id)}>Забронировать</Button>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsBookingDialogOpen(false)}>Закрыть</Button>
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

export default ClientAppointments;