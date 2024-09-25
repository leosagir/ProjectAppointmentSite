import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchSpecializations, createSpecialization, updateSpecialization, deleteSpecialization } from '../../store/slices/specializationsSlice';
import { SpecializationResponseDto, SpecializationRequestDto, SpecializationUpdateDto } from '../../types/specialization';
import styles from './SpecializationManagement.module.css';

const SpecializationManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const specializations = useSelector((state: RootState) => state.specializations.specializations);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSpecialization) {
      dispatch(updateSpecialization({ id: selectedSpecialization.id, data: formData as SpecializationUpdateDto }));
    } else {
      dispatch(createSpecialization(formData));
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту специализацию?')) {
      dispatch(deleteSpecialization(id));
    }
  };

  const resetForm = () => {
    setSelectedSpecialization(null);
    setFormData({
      title: '',
    });
  };

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