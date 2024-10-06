import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchCurrentClient } from '../../store/slices/clientSlice';
import ClientInfo from './ClientInfo';
import ClientAppointments from './ClientAppointments';
import ClientReviews from './ClientReview';
import ClientNotifications from './ClientNotifications';
import ServiceList from './ServiceList';
import { ClientResponseDto } from '../../types/client';
import { Box, Tabs, Tab, Typography } from '@mui/material';

const ClientDashboard: React.FC = () => {
  const client = useSelector((state: RootState) => state.clients.currentClient as ClientResponseDto | null);
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchCurrentClient());
  }, [dispatch]); 

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 16px)',
      margin: '8px 0',
      padding: 3,
      overflow: 'hidden'
    }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Кабинет клиента
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Добро пожаловать, {client?.firstName} {client?.lastName}!
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="client dashboard tabs">
          <Tab label="Моя информация" />
          <Tab label="Мои записи" />
          <Tab label="Мои отзывы" />
          <Tab label="Уведомления" />
          <Tab label="Услуги" />
        </Tabs>
      </Box>
      <Box sx={{ 
        flex: 1, 
        mt: 2, 
        overflow: 'auto'
      }}>
        {activeTab === 0 && <ClientInfo />}
        {activeTab === 1 && <ClientAppointments />}
        {activeTab === 2 && <ClientReviews />}
        {activeTab === 3 && <ClientNotifications />}
        {activeTab === 4 && <ServiceList />}
      </Box>
    </Box>
  );
};

export default ClientDashboard;