import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { clientApi } from '../../api/clientApi';
import { ClientResponseDto, ClientUpdateDto } from '../../types/client';
import { updateClient } from '../../store/slices/clientSlice';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';

const ClientInfo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const client = useSelector((state: RootState) => state.clients.currentClient as ClientResponseDto);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ClientUpdateDto>({
    firstName: client?.firstName || '',
    lastName: client?.lastName || '',
    phone: client?.phone || '',
    dateOfBirth: client?.dateOfBirth || '',
    address: client?.address || ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const updatedClient = await clientApi.updateClient(client.id, editForm);
      dispatch(updateClient({ id: client.id, data: updatedClient.data }));
      setIsEditing(false);
      setSnackbar({ open: true, message: 'Информация успешно обновлена', severity: 'success' });
    } catch (error) {
      console.error('Error updating client info:', error);
      setSnackbar({ open: true, message: 'Ошибка при обновлении информации', severity: 'error' });
    }
  };

  if (!client) {
    return <Typography>Загрузка информации о клиенте...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Информация о клиенте</Typography>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Имя"
                name="firstName"
                value={editForm.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Фамилия"
                name="lastName"
                value={editForm.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Телефон"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Дата рождения"
                name="dateOfBirth"
                value={editForm.dateOfBirth}
                onChange={handleInputChange}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Адрес"
                name="address"
                value={editForm.address}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">Сохранить</Button>
          </Box>
        </form>
      ) : (
        <Box>
          <Typography><strong>Имя:</strong> {client.firstName}</Typography>
          <Typography><strong>Фамилия:</strong> {client.lastName}</Typography>
          <Typography><strong>Email:</strong> {client.email}</Typography>
          <Typography><strong>Телефон:</strong> {client.phone}</Typography>
          <Typography><strong>Дата рождения:</strong> {client.dateOfBirth}</Typography>
          <Typography><strong>Адрес:</strong> {client.address}</Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
              Редактировать
            </Button>
          </Box>
        </Box>
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
    </Paper>
  );
};

export default ClientInfo;