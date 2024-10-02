import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { clientApi } from '../../api/clientApi';
import { NotificationResponseDto } from '../../types/notification';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import { Notifications as NotificationsIcon, Event as EventIcon } from '@mui/icons-material';

const ClientNotifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentClient = useSelector((state: RootState) => state.clients.currentClient);
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (currentClient) {
      fetchNotifications(currentClient.id);
    }
  }, [currentClient]);

  const fetchNotifications = async (clientId: number) => {
    try {
      const response = await clientApi.getClientNotifications(clientId);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке уведомлений', severity: 'error' });
    }
  };

  const renderNotificationContent = (notification: NotificationResponseDto) => {
    if (notification.appointmentId) {
      return (
        <>
          <EventIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1">
            Напоминание о записи: {new Date(notification.appointmentDate).toLocaleString()}
          </Typography>
        </>
      );
    } else {
      return (
        <>
          <NotificationsIcon color="info" sx={{ mr: 1 }} />
          <Typography variant="body1">Уведомление о записи #{notification.appointmentId}</Typography>
        </>
      );
    }
  };

  const getNotificationStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'primary';
      case 'READ':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Уведомления
      </Typography>
      {notifications.length > 0 ? (
        <List>
          {notifications.map((notification) => (
            <Paper key={notification.id} elevation={2} sx={{ mb: 2, p: 2 }}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      {renderNotificationContent(notification)}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Отправлено: {new Date(notification.sentAt).toLocaleString()}
                      </Typography>
                      <Chip 
                        label={notification.status} 
                        size="small" 
                        color={getNotificationStatusColor(notification.status)}
                        sx={{ ml: 1 }}
                      />
                    </>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      ) : (
        <Typography>У вас нет новых уведомлений.</Typography>
      )}
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

export default ClientNotifications;