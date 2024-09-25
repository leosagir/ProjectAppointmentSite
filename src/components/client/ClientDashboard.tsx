import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchClients } from '../../store/slices/clientSlice';
import ClientInfo from './ClientInfo';
import ClientAppointments from './ClientAppointments';
import ClientReviews from './ClientReview';
import ClientNotifications from './ClientNotifications';
import ServiceList from './ServiceList';
import { ClientResponseDto } from '../../types/client';

const ClientDashboard: React.FC = () => {
  const client = useSelector((state: RootState) => state.clients.currentClient as ClientResponseDto | null);
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  return (
    <div>
        <h1>Кабинет клиента</h1>
        <p>Добро пожаловать, {client?.firstName} {client?.lastName}!</p>
      <nav>
        <button onClick={() => setActiveTab('info')}>Моя информация</button>
        <button onClick={() => setActiveTab('appointments')}>Мои записи</button>
        <button onClick={() => setActiveTab('reviews')}>Мои отзывы</button>
        <button onClick={() => setActiveTab('notifications')}>Уведомления</button>
        <button onClick={() => setActiveTab('services')}>Услуги</button>
      </nav>
      {activeTab === 'info' && <ClientInfo client={client} />}
      {activeTab === 'appointments' && <ClientAppointments />}
      {activeTab === 'reviews' && <ClientReviews />}
      {activeTab === 'notifications' && <ClientNotifications />}
      {activeTab === 'services' && <ServiceList />}
    </div>
  );
};

export default ClientDashboard;