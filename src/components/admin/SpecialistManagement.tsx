import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchSpecialists,
  createSpecialist,
  updateSpecialist,
  deleteSpecialist,
  deactivateSpecialist,
  reactivateSpecialist
} from '../../store/slices/specialistSlice';
import { SpecialistResponseDto, SpecialistRequestDto, SpecialistUpdateDto } from '../../types/specialists';
import styles from './SpecialistManagement.module.css';

const SpecialistManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const specialists = useSelector((state: RootState) => state.specialists.specialists);
  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistResponseDto | null>(null);
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

  useEffect(() => {
    dispatch(fetchSpecialists());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'specializationIds' || name === 'serviceIds') {
      setFormData({ ...formData, [name]: value.split(',').map(Number) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSpecialist) {
      dispatch(updateSpecialist({ id: selectedSpecialist.id, data: formData as SpecialistUpdateDto }));
    } else {
      dispatch(createSpecialist(formData));
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого специалиста?')) {
      dispatch(deleteSpecialist(id));
    }
  };

  const handleDeactivate = (id: number) => {
    dispatch(deactivateSpecialist(id));
  };

  const handleReactivate = (id: number) => {
    dispatch(reactivateSpecialist(id));
  };

  const resetForm = () => {
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
  };

  return (
    <div className={styles.specialistManagement}>
      <h2>Управление специалистами</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        {!selectedSpecialist && (
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Пароль"
            required
          />
        )}
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Имя"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Фамилия"
          required
        />
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="specializationIds"
          value={formData.specializationIds.join(',')}
          onChange={handleInputChange}
          placeholder="ID специализаций (через запятую)"
        />
        <input
          type="text"
          name="serviceIds"
          value={formData.serviceIds.join(',')}
          onChange={handleInputChange}
          placeholder="ID услуг (через запятую)"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Описание"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Адрес"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Телефон"
          required
        />
        <button type="submit">{selectedSpecialist ? 'Обновить' : 'Создать'}</button>
        {selectedSpecialist && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>
      <ul className={styles.specialistList}>
        {specialists.map((specialist) => (
          <li key={specialist.id} className={styles.specialistItem}>
            <div className={styles.specialistInfo}>
              <span>{specialist.firstName} {specialist.lastName}</span>
              <span>{specialist.email}</span>
              <span>Статус: {specialist.status}</span>
            </div>
            <div className={styles.specialistActions}>
              <button onClick={() => setSelectedSpecialist(specialist)}>Редактировать</button>
              <button onClick={() => handleDelete(specialist.id)}>Удалить</button>
              {specialist.status === 'ACTIVE' ? (
                <button onClick={() => handleDeactivate(specialist.id)}>Деактивировать</button>
              ) : (
                <button onClick={() => handleReactivate(specialist.id)}>Реактивировать</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpecialistManagement;