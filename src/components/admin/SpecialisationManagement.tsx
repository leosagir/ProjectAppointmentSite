import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchSpecializations, createSpecialization, updateSpecialization, deleteSpecialization } from '../../store/slices/specializationsSlice';
import { SpecializationResponseDto, SpecializationRequestDto, SpecializationUpdateDto } from '../../types/specialization';
import styles from './SpecializationManagement.module.css';

const SpecializationManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const specializations = useSelector((state: RootState) => state.specializations.specializations);
  const status = useSelector((state: RootState) => state.specializations.status);
  const error = useSelector((state: RootState) => state.specializations.error);
  const [selectedSpecialization, setSelectedSpecialization] = useState<SpecializationResponseDto | null>(null);
  const [formData, setFormData] = useState<SpecializationRequestDto>({
    title: '',
  });

  useEffect(() => {
    dispatch(fetchSpecializations());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSpecialization) {
        await dispatch(updateSpecialization({ id: selectedSpecialization.id, data: formData as SpecializationUpdateDto })).unwrap();
      } else {
        await dispatch(createSpecialization(formData)).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save specialization:', err);
      alert('Failed to save specialization. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту специализацию?')) {
      try {
        await dispatch(deleteSpecialization(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete specialization:', err);
        alert('Failed to delete specialization. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setSelectedSpecialization(null);
    setFormData({
      title: '',
    });
  };

  if (status === 'loading') {
    return <div>Загрузка...</div>;
  }

  if (status === 'failed') {
    return <div>Ошибка: {error}. <button onClick={() => dispatch(fetchSpecializations())}>Попробовать снова</button></div>;
  }

  return (
    <div className={styles.specializationManagement}>
      <h2>Управление специализациями</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Название специализации"
          required
        />
        <button type="submit">{selectedSpecialization ? 'Обновить' : 'Создать'}</button>
        {selectedSpecialization && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>
      <ul className={styles.specializationList}>
        {specializations.map((specialization) => (
          <li key={specialization.id} className={styles.specializationItem}>
            <span>{specialization.title}</span>
            <div>
              <button onClick={() => setSelectedSpecialization(specialization)}>Редактировать</button>
              <button onClick={() => handleDelete(specialization.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpecializationManagement;


/*import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchSpecializations, createSpecialization, updateSpecialization, deleteSpecialization } from '../../store/slices/specializationsSlice';
import { SpecializationResponseDto, SpecializationRequestDto, SpecializationUpdateDto } from '../../types/specialization';
import styles from './SpecializationManagement.module.css';

const SpecializationManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const specializations = useSelector((state: RootState) => state.specializations.specializations);
  const status = useSelector((state: RootState) => state.specializations.status);
  const error = useSelector((state: RootState) => state.specializations.error);
  const [selectedSpecialization, setSelectedSpecialization] = useState<SpecializationResponseDto | null>(null);
  const [formData, setFormData] = useState<SpecializationRequestDto>({
    title: '',
  });

  useEffect(() => {
    dispatch(fetchSpecializations());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSpecialization) {
        await dispatch(updateSpecialization({ id: selectedSpecialization.id, data: formData as SpecializationUpdateDto })).unwrap();
      } else {
        await dispatch(createSpecialization(formData)).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save specialization:', err);
      // Здесь можно добавить отображение ошибки пользователю
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту специализацию?')) {
      try {
        await dispatch(deleteSpecialization(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete specialization:', err);
        // Здесь можно добавить отображение ошибки пользователю
      }
    }
  };

  const resetForm = () => {
    setSelectedSpecialization(null);
    setFormData({
      title: '',
    });
  };

  if (status === 'loading') {
    return <div>Загрузка...</div>;
  }

  if (status === 'failed') {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.specializationManagement}>
      <h2>Управление специализациями</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Название специализации"
          required
        />
        <button type="submit">{selectedSpecialization ? 'Обновить' : 'Создать'}</button>
        {selectedSpecialization && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>
      <ul className={styles.specializationList}>
        {specializations.map((specialization) => (
          <li key={specialization.id} className={styles.specializationItem}>
            <span>{specialization.title}</span>
            <div>
              <button onClick={() => setSelectedSpecialization(specialization)}>Редактировать</button>
              <button onClick={() => handleDelete(specialization.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpecializationManagement;*/