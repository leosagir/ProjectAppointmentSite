import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { updateSpecialist } from '../../store/slices/specialistSlice';
import { SpecialistResponseDto, SpecialistUpdateDto, specialistValidation } from '../../types/specialists';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface SpecialistInfoProps {
  specialist: SpecialistResponseDto | null;
}

const SpecialistInfo: React.FC<SpecialistInfoProps> = ({ specialist }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<SpecialistUpdateDto>({
    firstName: specialist?.firstName || '',
    lastName: specialist?.lastName || '',
    dateOfBirth: specialist?.dateOfBirth || '',
    description: specialist?.description || '',
    address: specialist?.address || '',
    phone: specialist?.phone || '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleDateChange = (date: Date | null) => {
    setEditForm({ ...editForm, dateOfBirth: date ? date.toISOString().split('T')[0] : '' });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (specialist) {
      try {
        await dispatch(updateSpecialist({ id: specialist.id, data: editForm })).unwrap();
        setIsEditing(false);
        setSnackbar({ open: true, message: 'Informationen erfolgreich aktualisiert', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Fehler beim Aktualisieren der Informationen', severity: 'error' });
      }
    }
  };

  if (!specialist) {
    return <Typography>Lade Spezialisteninformationen...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Spezialisteninformationen</Typography>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vorname"
                name="firstName"
                value={editForm.firstName}
                onChange={handleInputChange}
                inputProps={{ minLength: specialistValidation.firstName.min, maxLength: specialistValidation.firstName.max }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nachname"
                name="lastName"
                value={editForm.lastName}
                onChange={handleInputChange}
                inputProps={{ minLength: specialistValidation.lastName.min, maxLength: specialistValidation.lastName.max }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Geburtsdatum"
                  value={editForm.dateOfBirth ? new Date(editForm.dateOfBirth) : null}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Beschreibung"
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                inputProps={{ minLength: specialistValidation.description.min, maxLength: specialistValidation.description.max }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                name="address"
                value={editForm.address}
                onChange={handleInputChange}
                inputProps={{ maxLength: specialistValidation.address.max }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                inputProps={{ pattern: specialistValidation.phone.pattern.source }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>Abbrechen</Button>
            <Button type="submit" variant="contained" color="primary">Speichern</Button>
          </Box>
        </form>
      ) : (
        <Box>
          <Typography><strong>Vorname:</strong> {specialist.firstName}</Typography>
          <Typography><strong>Nachname:</strong> {specialist.lastName}</Typography>
          <Typography><strong>E-Mail:</strong> {specialist.email}</Typography>
          <Typography><strong>Geburtsdatum:</strong> {new Date(specialist.dateOfBirth).toLocaleDateString()}</Typography>
          <Typography><strong>Beschreibung:</strong> {specialist.description}</Typography>
          <Typography><strong>Adresse:</strong> {specialist.address}</Typography>
          <Typography><strong>Telefon:</strong> {specialist.phone}</Typography>
          <Typography><strong>Spezialisierungen:</strong></Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {specialist.specializations.map((spec) => (
              <Chip key={spec.id} label={spec.title || 'Unbekannte Spezialisierung'} />
            ))}
          </Box>
          <Typography><strong>Dienstleistungen:</strong></Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {specialist.services.map((service) => (
              <Chip key={service.id} label={service.title} />
            ))}
          </Box>
          <Typography><strong>Status:</strong> {specialist.status}</Typography>
          <Typography><strong>Erstellt am:</strong> {new Date(specialist.createdAt).toLocaleString()}</Typography>
          <Typography><strong>Aktualisiert am:</strong> {new Date(specialist.updatedAt).toLocaleString()}</Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
              Bearbeiten
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

export default SpecialistInfo;