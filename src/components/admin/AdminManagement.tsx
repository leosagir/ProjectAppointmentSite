import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchAdmins, createAdmin, updateAdmin, deactivateAdmin } from '../../store/slices/adminSlice';
import { AdminResponseDto, AdminRequestDto, AdminUpdateDto } from '../../types/admin';
import styles from './AdminManagement.module.css';

const AdminManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const admins = useSelector((state: RootState) => state.admins.admins);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminResponseDto | null>(null);
  const [formData, setFormData] = useState<AdminRequestDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAdmin) {
      dispatch(updateAdmin({ id: selectedAdmin.id, data: formData as AdminUpdateDto }));
    } else {
      dispatch(createAdmin(formData));
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите деактивировать этого администратора?')) {
      dispatch(deactivateAdmin(id));
    }
  };

  const resetForm = () => {
    setSelectedAdmin(null);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      address: '',
      phone: '',
    });
  };

  return (
    <div className={styles.adminManagement}>
      <h2>Управление администраторами</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        {!selectedAdmin && (
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
        <button type="submit">{selectedAdmin ? 'Обновить' : 'Создать'}</button>
        {selectedAdmin && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>
      <ul className={styles.adminList}>
        {admins.map((admin) => (
          <li key={admin.id} className={styles.adminItem}>
            <span>{admin.firstName} {admin.lastName} ({admin.email})</span>
            <div>
              <button onClick={() => setSelectedAdmin(admin)}>Редактировать</button>
              <button onClick={() => handleDelete(admin.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminManagement;