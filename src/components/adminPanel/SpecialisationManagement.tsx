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
        setSnackbar({ open: true, message: 'Специализация успешно обновлена', severity: 'success' });
      } else {
        await dispatch(createSpecialization(formData)).unwrap();
        setSnackbar({ open: true, message: 'Специализация успешно создана', severity: 'success' });
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Failed to save specialization:', err);
      setSnackbar({ open: true, message: 'Не удалось сохранить специализацию', severity: 'error' });
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
      setSnackbar({ open: true, message: 'Специализация успешно удалена', severity: 'success' });
    } catch (err) {
      console.error('Failed to delete specialization:', err);
      setSnackbar({ open: true, message: 'Не удалось удалить специализацию', severity: 'error' });
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
    return <div>Загрузка...</div>;
  }

  if (status === 'failed') {
    return (
      <Alert severity="error">
        Ошибка: {error}
        <Button color="inherit" size="small" onClick={() => dispatch(fetchSpecializations())}>
          Попробовать снова
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      <h2>Управление специализациями</h2>
      <Button variant="contained" color="primary" onClick={() => openDialog()}>
        Добавить новую специализацию
      </Button>
      <List>
        {specializations.map((specialization) => (
          <ListItem key={specialization.id}>
            <ListItemText primary={specialization.title} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => openDialog(specialization)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(specialization.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{selectedSpecialization ? 'Редактировать специализацию' : 'Создать новую специализацию'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Название специализации"
              type="text"
              fullWidth
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
            <Button type="submit" color="primary">
              {selectedSpecialization ? 'Обновить' : 'Создать'}
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
        <DialogTitle id="alert-dialog-title">{"Подтверждение удаления"}</DialogTitle>
        <DialogContent>
          <p id="alert-dialog-description">
            Вы уверены, что хотите удалить эту специализацию? Это действие нельзя отменить.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
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
    </div>
  );
};

export default SpecializationManagement;

/*
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
import styles from './SpecializationManagement.module.css';

const SpecializationManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const specializations = useSelector(selectAllSpecializations);
  const status = useSelector(selectSpecializationsStatus);
  const error = useSelector(selectSpecializationsError);
  
  const [selectedSpecialization, setSelectedSpecialization] = useState<SpecializationResponseDto | null>(null);
  const [formData, setFormData] = useState<SpecializationRequestDto>({ title: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

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
        setMessage({ text: 'Специализация успешно обновлена', type: 'success' });
      } else {
        await dispatch(createSpecialization(formData)).unwrap();
        setMessage({ text: 'Специализация успешно создана', type: 'success' });
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save specialization:', err);
      setMessage({ text: 'Не удалось сохранить специализацию', type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту специализацию?')) {
      try {
        await dispatch(deleteSpecialization(id)).unwrap();
        setMessage({ text: 'Специализация успешно удалена', type: 'success' });
      } catch (err) {
        console.error('Failed to delete specialization:', err);
        setMessage({ text: 'Не удалось удалить специализацию', type: 'error' });
      }
    }
  };

  const resetForm = () => {
    setSelectedSpecialization(null);
    setFormData({ title: '' });
    setIsEditing(false);
  };

  const startEditing = (specialization: SpecializationResponseDto) => {
    setSelectedSpecialization(specialization);
    setFormData({ title: specialization.title });
    setIsEditing(true);
  };

  if (status === 'loading') {
    return <div>Загрузка...</div>;
  }

  if (status === 'failed') {
    return (
      <div className={styles.error}>
        Ошибка: {error}
        <button onClick={() => dispatch(fetchSpecializations())}>Попробовать снова</button>
      </div>
    );
  }

  return (
    <div className={styles.specializationManagement}>
      <h2>Управление специализациями</h2>
      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Название специализации"
          required
        />
        <button type="submit">{isEditing ? 'Обновить' : 'Создать'}</button>
        {isEditing && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>
      <ul className={styles.specializationList}>
        {specializations.map((specialization) => (
          <li key={specialization.id} className={styles.specializationItem}>
            <span>{specialization.title}</span>
            <div>
              <button onClick={() => startEditing(specialization)}>Редактировать</button>
              <button onClick={() => handleDelete(specialization.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpecializationManagement;  */

