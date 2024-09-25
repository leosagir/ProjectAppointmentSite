import React, { useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import SpecialistManagement from '../components/admin/SpecialistManagement';
import AppointmentManagement from '../components/admin/AppointmentManagement';
import ClientManagement from '../components/admin/ClientManagement';
import AdminManagement from '../components/admin/AdminManagement';
import ReviewManagement from '../components/admin/ReviewManagement';
import NotificationManagement from '../components/admin/NotificationManagement';
import ServiceManagement from '../components/admin/ServiceManagement';
import SpecializationManagement from '../components/admin/SpecialisationManagement';
import styles from './AdminPanel.module.css'

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('specialists');

  return (
    <div className={styles.adminPanel}>
      <nav className={styles.sidebar}>
        <ul>
          <li>
            <Link to="/admin/specialists" onClick={() => setActiveTab('specialists')}>
              Управление специалистами
            </Link>
          </li>
          <li>
            <Link to="/admin/appointments" onClick={() => setActiveTab('appointments')}>
              Управление записями
            </Link>
          </li>
          <li>
            <Link to="/admin/clients" onClick={() => setActiveTab('clients')}>
              Управление клиентами
            </Link>
          </li>
          <li>
            <Link to="/admin/admins" onClick={() => setActiveTab('admins')}>
              Управление администраторами
            </Link>
          </li>
          <li>
            <Link to="/admin/reviews" onClick={() => setActiveTab('reviews')}>
              Управление отзывами
            </Link>
          </li>
          <li>
            <Link to="/admin/notifications" onClick={() => setActiveTab('notifications')}>
              Управление оповещениями
            </Link>
          </li>
          <li>
            <Link to="/admin/services" onClick={() => setActiveTab('services')}>
              Управление услугами
            </Link>
          </li>
          <li>
            <Link to="/admin/specializations" onClick={() => setActiveTab('specializations')}>
              Управление специализациями
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.content}>
        <Routes>
          <Route path="specialists" element={<SpecialistManagement />} />
          <Route path="appointments" element={<AppointmentManagement />} />
          <Route path="clients" element={<ClientManagement />} />
          <Route path="admins" element={<AdminManagement />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="services" element={<ServiceManagement />} />
          <Route path="specializations" element={<SpecializationManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;