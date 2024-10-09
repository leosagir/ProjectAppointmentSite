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
        setSnackbar({ open: true, message: 'Dienstleistung erfolgreich aktualisiert', severity: 'success' });
      } else {
        await dispatch(createService(formData)).unwrap();
        setSnackbar({ open: true, message: 'Dienstleistung erfolgreich erstellt', severity: 'success' });
      }
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Dienstleistung konnte nicht gespeichert werden', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      await dispatch(deleteService(selectedService.id)).unwrap();
      setSnackbar({ open: true, message: 'Dienstleistung erfolgreich gelöscht', severity: 'success' });
      handleCloseDeleteDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Dienstleistung konnte nicht gelöscht werden', severity: 'error' });
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
        Fehler: {error}
        <Button color="inherit" size="small" onClick={() => dispatch(fetchServices())}>
          Erneut versuchen
        </Button>
      </Alert>
    );
  }

  return (
    <Paper style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <Typography variant="h4" gutterBottom>Dienstleistungsverwaltung</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px' }}
      >
        Neue Dienstleistung hinzufügen
      </Button>
      <List>
        {services.map((service) => (
          <ListItem key={service.id}>
            <ListItemText 
              primary={service.title} 
              secondary={`Dauer: ${service.duration} Min, Preis: ${service.price}, Spezialisierung: ${service.specialization.title}`} 
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
        <DialogTitle>{selectedService ? 'Dienstleistung bearbeiten' : 'Neue Dienstleistung erstellen'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dienstleistungsname"
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
                  label="Beschreibung der Dienstleistung"
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
                  label="Dauer (Min)"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Preis"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="specialization-select-label">Spezialisierung</InputLabel>
                  <Select
                    labelId="specialization-select-label"
                    id="specialization-select"
                    value={formData.specializationId}
                    label="Spezialisierung"
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
            <Button onClick={handleCloseDialog}>Abbrechen</Button>
            <Button type="submit" color="primary">
              {selectedService ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={isViewDialogOpen} onClose={handleCloseViewDialog}>
        <DialogTitle>Dienstleistungsdetails</DialogTitle>
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
                <Typography variant="body2">Dauer: {selectedService.duration} Min</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Preis: {selectedService.price}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">Spezialisierung: {selectedService.specialization.title}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} color="primary">Schließen</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Löschbestätigung"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Sind Sie sicher, dass Sie diese Dienstleistung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Abbrechen
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Löschen
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