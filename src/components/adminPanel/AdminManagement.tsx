import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import {
  fetchAdmins,
  createAdmin,
  updateAdmin,
  deactivateAdmin,
  reactivateAdmin,
  selectAllAdmins,
  selectAdminsStatus,
  selectAdminsError
} from '../../store/slices/adminSlice';
import { AdminResponseDto, AdminRequestDto, AdminUpdateDto } from '../../types/admin';
import { 
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Grid,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Alert } from '@mui/material';

const AdminManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const admins = useSelector(selectAllAdmins);
  const status = useSelector(selectAdminsStatus);
  const error = useSelector(selectAdminsError);

  const [selectedAdmin, setSelectedAdmin] = useState<AdminResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AdminRequestDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    phone: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [searchLastName, setSearchLastName] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAdmins());
    }
  }, [status, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedAdmin) {
        await dispatch(updateAdmin({ id: selectedAdmin.id, data: formData as AdminUpdateDto })).unwrap();
        setSnackbar({ open: true, message: 'Администратор успешно обновлен', severity: 'success' });
      } else {
        await dispatch(createAdmin(formData)).unwrap();
        setSnackbar({ open: true, message: 'Администратор успешно создан', severity: 'success' });
      }
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Не удалось сохранить администратора', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    try {
      await dispatch(deactivateAdmin(selectedAdmin.id)).unwrap();
      setSnackbar({ open: true, message: 'Администратор успешно деактивирован', severity: 'success' });
      handleCloseDeleteDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Не удалось деактивировать администратора', severity: 'error' });
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      await dispatch(reactivateAdmin(id)).unwrap();
      setSnackbar({ open: true, message: 'Администратор успешно реактивирован', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Не удалось реактивировать администратора', severity: 'error' });
    }
  };

  const handleOpenDialog = (admin?: AdminResponseDto) => {
    if (admin) {
      setSelectedAdmin(admin);
      setFormData({
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        dateOfBirth: admin.dateOfBirth,
        address: admin.address,
        phone: admin.phone,
        password: '' // We don't set the password when editing
      });
    } else {
      setSelectedAdmin(null);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        address: '',
        phone: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAdmin(null);
  };

  const handleOpenViewDialog = (admin: AdminResponseDto) => {
    setSelectedAdmin(admin);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedAdmin(null);
  };

  const handleOpenDeleteDialog = (admin: AdminResponseDto) => {
    setSelectedAdmin(admin);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedAdmin(null);
  };

  const filteredAdmins = admins.filter(admin => 
    admin.lastName.toLowerCase().includes(searchLastName.toLowerCase())
  );

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return (
      <Alert severity="error">
        Ошибка: {error}
        <Button color="inherit" size="small" onClick={() => dispatch(fetchAdmins())}>
          Попробовать снова
        </Button>
      </Alert>
    );
  }

  return (
    <Paper style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <Typography variant="h4" gutterBottom>Administratorenverwaltung</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px' }}
      >
        Neuen Administrator hinzufügen
      </Button>

      <TextField
        fullWidth
        label="Suche nach Nachname"
        value={searchLastName}
        onChange={(e) => setSearchLastName(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <List>
        {filteredAdmins.map((admin) => (
          <ListItem key={admin.id}>
            <ListItemText 
              primary={`${admin.lastName} ${admin.firstName}`}
              secondary={`Email: ${admin.email}, Телефон: ${admin.phone}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="view" onClick={() => handleOpenViewDialog(admin)}>
                <VisibilityIcon />
              </IconButton>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(admin)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(admin)}>
                <DeleteIcon />
              </IconButton>
              {admin.status === 'INACTIVE' && (
                <Button onClick={() => handleReactivate(admin.id)}>Реактивировать</Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{selectedAdmin ? 'Administrator bearbeiten' : 'Neuen Administrator erstellen'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              {/* ... (form fields remain the same, labels are translated) */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="E-Mail"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              {!selectedAdmin && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Passwort"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Vorname"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nachname"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Geburtsdatum"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Telefon"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Abbrechen</Button>
            <Button type="submit" color="primary">
              {selectedAdmin ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={isViewDialogOpen} onClose={handleCloseViewDialog}>
        <DialogTitle>Детали администратора</DialogTitle>
        <DialogContent>
          {selectedAdmin && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">{`${selectedAdmin.lastName} ${selectedAdmin.firstName}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Email: {selectedAdmin.email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Телефон: {selectedAdmin.phone}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Дата рождения: {selectedAdmin.dateOfBirth}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Адрес: {selectedAdmin.address}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Статус: {selectedAdmin.status}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} color="primary">Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Подтверждение деактивации"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Вы уверены, что хотите деактивировать этого администратора? Это действие можно будет отменить позже.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Деактивировать
          </Button>
        </DialogActions>
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
  );
};

export default AdminManagement;