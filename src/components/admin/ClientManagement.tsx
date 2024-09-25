import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchClients, createClient, updateClient, deactivateClient } from '../../store/slices/clientSlice';
import { ClientResponseDto, ClientRequestDto, ClientUpdateDto } from '../../types/client';
import styles from './ClientManagement.module.css';

const ClientManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const clients = useSelector((state: RootState) => state.clients.clients);
  const [selectedClient, setSelectedClient] = useState<ClientResponseDto | null>(null);
  const [formData, setFormData] = useState<ClientRequestDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient) {
      dispatch(updateClient({ id: selectedClient.id, data: formData as ClientUpdateDto }));
    } else {
      dispatch(createClient(formData));
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      dispatch(deactivateClient(id));
    }
  };

  const resetForm = () => {
    setSelectedClient(null);
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
    <div className={styles.clientManagement}>
      <h2>Управление клиентами</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        {!selectedClient && (
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
        <button type="submit">{selectedClient ? 'Обновить' : 'Создать'}</button>
        {selectedClient && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>
      <ul className={styles.clientList}>
        {clients.map((client) => (
          <li key={client.id} className={styles.clientItem}>
            <span>{client.firstName} {client.lastName} ({client.email})</span>
            <div>
              <button onClick={() => setSelectedClient(client)}>Редактировать</button>
              <button onClick={() => handleDelete(client.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientManagement;