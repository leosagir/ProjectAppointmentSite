import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  selectAllServices,
  selectServicesStatus,
  selectServicesError
} from '../../store/slices/servicesSlice';
import { fetchSpecializations, selectAllSpecializations } from '../../store/slices/specializationsSlice';
import { ServiceResponseDto, ServiceRequestDto, ServiceUpdateDto } from '../../types/services';
import { SpecializationResponseDto } from '../../types/specialization';
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
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Alert } from '@mui/material';

const ServiceManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector(selectAllServices);
  const specializations = useSelector(selectAllSpecializations);
  const status = useSelector(selectServicesStatus);
  const error = useSelector(selectServicesError);

  const [selectedService, setSelectedService] = useState<ServiceResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceRequestDto>({
    title: '',
    description: '',
    duration: 0,
    price: '',
    specializationId: 0,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchServices());
      dispatch(fetchSpecializations());
    }
  }, [status, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSpecializationChange = (event: SelectChangeEvent<number>) => {
    const specializationId = event.target.value as number;
    setFormData(prev => ({
      ...prev,
      specializationId: specializationId
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedService) {
        await dispatch(updateService({ id: selectedService.id, data: formData as ServiceUpdateDto })).unwrap();
        setSnackbar({ open: true, message: 'Услуга успешно обновлена', severity: 'success' });
      } else {
        await dispatch(createService(formData)).unwrap();
        setSnackbar({ open: true, message: 'Услуга успешно создана', severity: 'success' });
      }
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Не удалось сохранить услугу', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      await dispatch(deleteService(selectedService.id)).unwrap();
      setSnackbar({ open: true, message: 'Услуга успешно удалена', severity: 'success' });
      handleCloseDeleteDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Не удалось удалить услугу', severity: 'error' });
    }
  };

  const handleOpenDialog = (service?: ServiceResponseDto) => {
    if (service) {
      setSelectedService(service);
      setFormData({
        title: service.title,
        description: service.description,
        duration: service.duration,
        price: service.price,
        specializationId: service.specialization.id,
      });
    } else {
      setSelectedService(null);
      setFormData({
        title: '',
        description: '',
        duration: 0,
        price: '',
        specializationId: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedService(null);
    setFormData({
      title: '',
      description: '',
      duration: 0,
      price: '',
      specializationId: 0,
    });
  };

  const handleOpenViewDialog = (service: ServiceResponseDto) => {
    setSelectedService(service);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedService(null);
  };

  const handleOpenDeleteDialog = (service: ServiceResponseDto) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedService(null);
  };

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return (
      <Alert severity="error">
        Ошибка: {error}
        <Button color="inherit" size="small" onClick={() => dispatch(fetchServices())}>
          Попробовать снова
        </Button>
      </Alert>
    );
  }

  return (
    <Paper style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <Typography variant="h4" gutterBottom>Управление услугами</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px' }}
      >
        Добавить новую услугу
      </Button>
      <List>
        {services.map((service) => (
          <ListItem key={service.id}>
            <ListItemText 
              primary={service.title} 
              secondary={`Длительность: ${service.duration} мин, Цена: ${service.price}, Специализация: ${service.specialization.title}`} 
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="view" onClick={() => handleOpenViewDialog(service)}>
                <VisibilityIcon />
              </IconButton>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(service)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(service)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{selectedService ? 'Редактировать услугу' : 'Создать новую услугу'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Название услуги"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Описание услуги"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Длительность (мин)"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Цена"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="specialization-select-label">Специализация</InputLabel>
                  <Select
                    labelId="specialization-select-label"
                    id="specialization-select"
                    value={formData.specializationId}
                    label="Специализация"
                    onChange={handleSpecializationChange}
                  >
                    {specializations.map((spec) => (
                      <MenuItem key={spec.id} value={spec.id}>{spec.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button type="submit" color="primary">
              {selectedService ? 'Обновить' : 'Создать'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={isViewDialogOpen} onClose={handleCloseViewDialog}>
        <DialogTitle>Детали услуги</DialogTitle>
        <DialogContent>
          {selectedService && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">{selectedService.title}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">{selectedService.description}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Длительность: {selectedService.duration} мин</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Цена: {selectedService.price}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">Специализация: {selectedService.specialization.title}</Typography>
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
        <DialogTitle id="alert-dialog-title">{"Подтверждение удаления"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Вы уверены, что хотите удалить эту услугу? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Удалить
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

export default ServiceManagement;


/*
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchServices, createService, updateService, deleteService } from '../../store/slices/servicesSlice';
import { ServiceResponseDto, ServiceRequestDto, ServiceUpdateDto } from '../../types/services';
import styles from './ServiceManagement.module.css';

const ServiceManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector((state: RootState) => state.services.services);
  const [selectedService, setSelectedService] = useState<ServiceResponseDto | null>(null);
  const [formData, setFormData] = useState<ServiceRequestDto>({
    title: '',
    description: '',
    duration: 0,
    price: '',
    specializationId: 0,
  });

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService) {
      dispatch(updateService({ id: selectedService.id, data: formData as ServiceUpdateDto }));
    } else {
      dispatch(createService(formData));
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту услугу?')) {
      dispatch(deleteService(id));
    }
  };

  const resetForm = () => {
    setSelectedService(null);
    setFormData({
      title: '',
      description: '',
      duration: 0,
      price: '',
      specializationId: 0,
    });
  };

  return (
    <div className={styles.serviceManagement}>
      <h2>Управление услугами</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Название услуги"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Описание услуги"
          required
        />
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleInputChange}
          placeholder="Длительность (в минутах)"
          required
        />
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Цена"
          required
        />
        <input
          type="number"
          name="specializationId"
          value={formData.specializationId}
          onChange={handleInputChange}
          placeholder="ID специализации"
          required
        />
        <button type="submit">{selectedService ? 'Обновить' : 'Создать'}</button>
        {selectedService && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>
      <ul className={styles.serviceList}>
        {services.map((service) => (
          <li key={service.id} className={styles.serviceItem}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <span>Длительность: {service.duration} мин</span>
            <span>Цена: {service.price}</span>
            <div>
              <button onClick={() => setSelectedService(service)}>Редактировать</button>
              <button onClick={() => handleDelete(service.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceManagement;  */