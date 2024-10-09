import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchSpecializations,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
  selectAllSpecializations,
  selectSpecializationsStatus,
  selectSpecializationsError
} from '../../store/slices/specializationsSlice';
import { SpecializationResponseDto, SpecializationRequestDto, SpecializationUpdateDto } from '../../types/specialization';
import { Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Alert } from '@mui/material';

const SpecializationManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const specializations = useSelector(selectAllSpecializations);
  const status = useSelector(selectSpecializationsStatus);
  const error = useSelector(selectSpecializationsError);
  
  const [selectedSpecialization, setSelectedSpecialization] = useState<SpecializationResponseDto | null>(null);
  const [formData, setFormData] = useState<SpecializationRequestDto>({ title: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [specializationToDelete, setSpecializationToDelete] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSpecializations());
    }
  }, [status, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSpecialization) {
        await dispatch(updateSpecialization({ id: selectedSpecialization.id, data: formData as SpecializationUpdateDto })).unwrap();
        setSnackbar({ open: true, message: 'Spezialisierung erfolgreich aktualisiert', severity: 'success' });
      } else {
        await dispatch(createSpecialization(formData)).unwrap();
        setSnackbar({ open: true, message: 'Spezialisierung erfolgreich erstellt', severity: 'success' });
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Fehler beim Speichern der Spezialisierung:', err);
      setSnackbar({ open: true, message: 'Spezialisierung konnte nicht gespeichert werden', severity: 'error' });
    }
  };

  const handleDeleteClick = (id: number) => {
    setSpecializationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (specializationToDelete === null) return;
    
    try {
      await dispatch(deleteSpecialization(specializationToDelete)).unwrap();
      setSnackbar({ open: true, message: 'Spezialisierung erfolgreich gelöscht', severity: 'success' });
    } catch (err) {
      console.error('Fehler beim Löschen der Spezialisierung:', err);
      setSnackbar({ open: true, message: 'Spezialisierung konnte nicht gelöscht werden', severity: 'error' });
    } finally {
      setIsDeleteDialogOpen(false);
      setSpecializationToDelete(null);
    }
  };

  const resetForm = () => {
    setSelectedSpecialization(null);
    setFormData({ title: '' });
  };

  const openDialog = (specialization?: SpecializationResponseDto) => {
    if (specialization) {
      setSelectedSpecialization(specialization);
      setFormData({ title: specialization.title });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  if (status === 'loading') {
    return <div>Laden...</div>;
  }

  if (status === 'failed') {
    return (
      <Alert severity="error">
        Fehler: {error}
        <Button color="inherit" size="small" onClick={() => dispatch(fetchSpecializations())}>
          Erneut versuchen
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      <h2>Spezialisierungsverwaltung</h2>
      <Button variant="contained" color="primary" onClick={() => openDialog()}>
        Neue Spezialisierung hinzufügen
      </Button>
      <List>
        {specializations.map((specialization) => (
          <ListItem key={specialization.id}>
            <ListItemText primary={specialization.title} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="bearbeiten" onClick={() => openDialog(specialization)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="löschen" onClick={() => handleDeleteClick(specialization.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{selectedSpecialization ? 'Spezialisierung bearbeiten' : 'Neue Spezialisierung erstellen'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Spezialisierungsname"
              type="text"
              fullWidth
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Abbrechen</Button>
            <Button type="submit" color="primary">
              {selectedSpecialization ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Löschbestätigung"}</DialogTitle>
        <DialogContent>
          <p id="alert-dialog-description">
            Sind Sie sicher, dass Sie diese Spezialisierung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
            Abbrechen
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
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
    </div>
  );
};

export default SpecializationManagement;