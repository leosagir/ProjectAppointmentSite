import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchSpecialists,
  createSpecialist,
  updateSpecialist,
  deleteSpecialist,
  deactivateSpecialist,
  reactivateSpecialist,
  selectAllSpecialists,
  selectSpecialistsStatus,
  selectSpecialistsError
} from '../../store/slices/specialistSlice';
import { fetchSpecializations, selectAllSpecializations } from '../../store/slices/specializationsSlice';
import { fetchServices, selectAllServices } from '../../store/slices/servicesSlice';
import { SpecialistResponseDto, SpecialistRequestDto, SpecialistUpdateDto } from '../../types/specialists';

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
  Chip,
  Box
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { SpecializationShortDto } from '../../types/specialization';
import { ServiceResponseDto } from '../../types/services';

const SpecialistManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const specialists = useSelector(selectAllSpecialists);
  const specializations = useSelector(selectAllSpecializations);
  const services = useSelector(selectAllServices);
  const status = useSelector(selectSpecialistsStatus);
  const error = useSelector(selectSpecialistsError);

  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<SpecialistRequestDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    specializationIds: [],
    serviceIds: [],
    description: '',
    address: '',
    phone: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [searchLastName, setSearchLastName] = useState('');
  const [searchSpecialization, setSearchSpecialization] = useState<number | ''>('');
  const [searchService, setSearchService] = useState<number | ''>('');
  const [availableServices, setAvailableServices] = useState<typeof services>([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSpecialists());
      dispatch(fetchSpecializations());
      dispatch(fetchServices());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const filteredServices = services.filter((service: ServiceResponseDto) => 
      formData.specializationIds.includes(service.specialization.id)
    );
    setAvailableServices(filteredServices);
  }, [formData.specializationIds, services]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (event: SelectChangeEvent<number[]>, fieldName: 'specializationIds' | 'serviceIds') => {
    const selectedIds = event.target.value as number[];
    setFormData(prev => ({ ...prev, [fieldName]: selectedIds }));
    
    if (fieldName === 'specializationIds') {
      setFormData(prev => ({ ...prev, serviceIds: [] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSpecialist) {
        await dispatch(updateSpecialist({ id: selectedSpecialist.id, data: formData as SpecialistUpdateDto })).unwrap();
        setSnackbar({ open: true, message: 'Специалист успешно обновлен', severity: 'success' });
      } else {
        await dispatch(createSpecialist(formData)).unwrap();
        setSnackbar({ open: true, message: 'Специалист успешно создан', severity: 'success' });
      }
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Не удалось сохранить специалиста', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedSpecialist) return;
    try {
      await dispatch(deleteSpecialist(selectedSpecialist.id)).unwrap();
      setSnackbar({ open: true, message: 'Специалист успешно удален', severity: 'success' });
      handleCloseDeleteDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Не удалось удалить специалиста', severity: 'error' });
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await dispatch(deactivateSpecialist(id)).unwrap();
      setSnackbar({ open: true, message: 'Специалист успешно деактивирован', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Не удалось деактивировать специалиста', severity: 'error' });
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      await dispatch(reactivateSpecialist(id)).unwrap();
      setSnackbar({ open: true, message: 'Специалист успешно реактивирован', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Не удалось реактивировать специалиста', severity: 'error' });
    }
  };

  const handleOpenDialog = (specialist?: SpecialistResponseDto) => {
    if (specialist) {
      setSelectedSpecialist(specialist);
      setFormData({
        email: specialist.email,
        firstName: specialist.firstName,
        lastName: specialist.lastName,
        dateOfBirth: specialist.dateOfBirth,
        specializationIds: specialist.specializations.map(s => s.id),
        serviceIds: specialist.services.map(s => s.id),
        description: specialist.description,
        address: specialist.address,
        phone: specialist.phone,
        password: ''
      });
    } else {
      setSelectedSpecialist(null);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        specializationIds: [],
        serviceIds: [],
        description: '',
        address: '',
        phone: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSpecialist(null);
  };

  const handleOpenViewDialog = (specialist: SpecialistResponseDto) => {
    setSelectedSpecialist(specialist);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedSpecialist(null);
  };

  const handleOpenDeleteDialog = (specialist: SpecialistResponseDto) => {
    setSelectedSpecialist(specialist);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedSpecialist(null);
  };

  const filteredSpecialists = specialists.filter(specialist => 
    specialist.lastName.toLowerCase().includes(searchLastName.toLowerCase()) &&
    (searchSpecialization === '' || specialist.specializations.some(s => s.id === searchSpecialization)) &&
    (searchService === '' || specialist.services.some(s => s.id === searchService))
  );

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return (
      <Alert severity="error">
        Ошибка: {error}
        <Button color="inherit" size="small" onClick={() => dispatch(fetchSpecialists())}>
          Попробовать снова
        </Button>
      </Alert>
    );
  }

  return (
    <Paper style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <Typography variant="h4" gutterBottom>Управление специалистами</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px' }}
      >
        Добавить нового специалиста
      </Button>

      <Grid container spacing={2} style={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Поиск по фамилии"
            value={searchLastName}
            onChange={(e) => setSearchLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Поиск по специализации</InputLabel>
            <Select
              value={searchSpecialization}
              onChange={(e) => setSearchSpecialization(e.target.value as number)}
            >
              <MenuItem value="">Все</MenuItem>
              {specializations.map((spec) => (
                <MenuItem key={spec.id} value={spec.id}>{spec.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Поиск по услуге</InputLabel>
            <Select
              value={searchService}
              onChange={(e) => setSearchService(e.target.value as number)}
            >
              <MenuItem value="">Все</MenuItem>
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>{service.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <List>
        {filteredSpecialists.map((specialist) => (
          <ListItem key={specialist.id}>
            <ListItemText 
              primary={`${specialist.lastName} ${specialist.firstName}`}
              secondary={`Email: ${specialist.email}, Телефон: ${specialist.phone}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="view" onClick={() => handleOpenViewDialog(specialist)}>
                <VisibilityIcon />
              </IconButton>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(specialist)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(specialist)}>
                <DeleteIcon />
              </IconButton>
              {specialist.status === 'ACTIVE' ? (
                <Button onClick={() => handleDeactivate(specialist.id)}>Деактивировать</Button>
              ) : (
                <Button onClick={() => handleReactivate(specialist.id)}>Реактивировать</Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{selectedSpecialist ? 'Редактировать специалиста' : 'Создать нового специалиста'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              {!selectedSpecialist && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Пароль"
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
                  label="Имя"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Фамилия"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Дата рождения"
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
                <FormControl fullWidth>
                  <InputLabel>Специализации</InputLabel>
                  <Select
                    multiple
                    value={formData.specializationIds}
                    onChange={(e: SelectChangeEvent<number[]>) => handleMultiSelectChange(e, 'specializationIds')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as number[]).map((value) => (
                          <Chip key={value} label={specializations.find(s => s.id === value)?.title} />
                        ))}
                      </Box>
                    )}
                  >                  
                      {specializations.map((spec) => (
                        <MenuItem key={spec.id} value={spec.id}>
                          {spec.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Услуги</InputLabel>
                    <Select
  multiple
  value={formData.serviceIds}
  onChange={(e: SelectChangeEvent<number[]>) => handleMultiSelectChange(e, 'serviceIds')}
  renderValue={(selected) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {(selected as number[]).map((value) => (
        <Chip key={value} label={availableServices.find(s => s.id === value)?.title} />
      ))}
    </Box>
  )}
  disabled={formData.specializationIds.length === 0}
>
  {availableServices.map((service) => (
    <MenuItem key={service.id} value={service.id}>
      {service.title}
    </MenuItem>
  ))}
</Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Описание"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Адрес"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Телефон"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Отмена</Button>
              <Button type="submit" color="primary">
                {selectedSpecialist ? 'Обновить' : 'Создать'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
  
        <Dialog open={isViewDialogOpen} onClose={handleCloseViewDialog}>
          <DialogTitle>Детали специалиста</DialogTitle>
          <DialogContent>
            {selectedSpecialist && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{`${selectedSpecialist.lastName} ${selectedSpecialist.firstName}`}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Email: {selectedSpecialist.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Телефон: {selectedSpecialist.phone}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Дата рождения: {selectedSpecialist.dateOfBirth}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Адрес: {selectedSpecialist.address}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Описание: {selectedSpecialist.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Специализации:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedSpecialist.specializations.map((spec) => (
                      <Chip key={spec.id} label={spec.title} />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
              <Typography variant="body1">Услуги:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedSpecialist.services.map((service) => (
                  <Chip key={service.id} label={service.title} />
                ))}
              </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Статус: {selectedSpecialist.status}</Typography>
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
              Вы уверены, что хотите удалить этого специалиста? Это действие нельзя отменить.
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
  
  export default SpecialistManagement;