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
        setSnackbar({ open: true, message: 'Spezialist erfolgreich aktualisiert', severity: 'success' });
      } else {
        await dispatch(createSpecialist(formData)).unwrap();
        setSnackbar({ open: true, message: 'Spezialist erfolgreich erstellt', severity: 'success' });
      }
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Spezialist konnte nicht gespeichert werden', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedSpecialist) return;
    try {
      await dispatch(deleteSpecialist(selectedSpecialist.id)).unwrap();
      setSnackbar({ open: true, message: 'Spezialist erfolgreich gelöscht', severity: 'success' });
      handleCloseDeleteDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Spezialist konnte nicht gelöscht werden', severity: 'error' });
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await dispatch(deactivateSpecialist(id)).unwrap();
      setSnackbar({ open: true, message: 'Spezialist erfolgreich deaktiviert', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Spezialist konnte nicht deaktiviert werden', severity: 'error' });
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      await dispatch(reactivateSpecialist(id)).unwrap();
      setSnackbar({ open: true, message: 'Spezialist erfolgreich reaktiviert', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Spezialist konnte nicht reaktiviert werden', severity: 'error' });
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
        Fehler: {error}
        <Button color="inherit" size="small" onClick={() => dispatch(fetchSpecialists())}>
          Erneut versuchen
        </Button>
      </Alert>
    );
  }

  return (
    <Paper style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <Typography variant="h4" gutterBottom>Spezialistenverwaltung</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px' }}
      >
        Neuen Spezialisten hinzufügen
      </Button>

      <Grid container spacing={2} style={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Suche nach Nachname"
            value={searchLastName}
            onChange={(e) => setSearchLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Suche nach Spezialisierung</InputLabel>
            <Select
              value={searchSpecialization}
              onChange={(e) => setSearchSpecialization(e.target.value as number)}
            >
              <MenuItem value="">Alle</MenuItem>
              {specializations.map((spec) => (
                <MenuItem key={spec.id} value={spec.id}>{spec.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Suche nach Dienstleistung</InputLabel>
            <Select
              value={searchService}
              onChange={(e) => setSearchService(e.target.value as number)}
            >
              <MenuItem value="">Alle</MenuItem>
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
              secondary={`E-Mail: ${specialist.email}, Telefon: ${specialist.phone}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="ansehen" onClick={() => handleOpenViewDialog(specialist)}>
                <VisibilityIcon />
              </IconButton>
              <IconButton edge="end" aria-label="bearbeiten" onClick={() => handleOpenDialog(specialist)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="löschen" onClick={() => handleOpenDeleteDialog(specialist)}>
                <DeleteIcon />
              </IconButton>
              {specialist.status === 'ACTIVE' ? (
                <Button onClick={() => handleDeactivate(specialist.id)}>Deaktivieren</Button>
              ) : (
                <Button onClick={() => handleReactivate(specialist.id)}>Reaktivieren</Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{selectedSpecialist ? 'Spezialist bearbeiten' : 'Neuen Spezialisten erstellen'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
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
              {!selectedSpecialist && (
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
                <FormControl fullWidth>
                  <InputLabel>Spezialisierungen</InputLabel>
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
                  <InputLabel>Dienstleistungen</InputLabel>
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
                  label="Beschreibung"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
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
              {selectedSpecialist ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={isViewDialogOpen} onClose={handleCloseViewDialog}>
        <DialogTitle>Spezialistendetails</DialogTitle>
        <DialogContent>
          {selectedSpecialist && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">{`${selectedSpecialist.lastName} ${selectedSpecialist.firstName}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">E-Mail: {selectedSpecialist.email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Telefon: {selectedSpecialist.phone}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Geburtsdatum: {selectedSpecialist.dateOfBirth}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Adresse: {selectedSpecialist.address}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Beschreibung: {selectedSpecialist.description}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Spezialisierungen:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedSpecialist.specializations.map((spec) => (
                    <Chip key={spec.id} label={spec.title} />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Dienstleistungen:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedSpecialist.services.map((service) => (
                    <Chip key={service.id} label={service.title} />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Status: {selectedSpecialist.status}</Typography>
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
            Sind Sie sicher, dass Sie diesen Spezialisten löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
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

export default SpecialistManagement;