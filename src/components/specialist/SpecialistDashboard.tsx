import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchSpecialists } from '../../store/slices/specialistSlice';
import SpecialistInfo from './SpecialistInfoProps';
import SpecialistAppointments from './SpecialistAppointments';
import SpecialistServices from './SpecialistServices';
import SpecialistReviews from './SpecialistReviews';
import styles from './SpecialistDashboard.module.css'

const SpecialistDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const specialist = useSelector((state: RootState) => state.specialists.currentSpecialist);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    dispatch(fetchSpecialists());
  }, [dispatch]);

  return (
    <div className="specialist-dashboard">
      <h1>Панель специалиста</h1>
      <nav>
        <button onClick={() => setActiveTab('info')}>Моя информация</button>
        <button onClick={() => setActiveTab('appointments')}>Мои записи</button>
        <button onClick={() => setActiveTab('services')}>Мои услуги</button>
        <button onClick={() => setActiveTab('reviews')}>Отзывы обо мне</button>
      </nav>
      {activeTab === 'info' && <SpecialistInfo specialist={specialist} />}
      {activeTab === 'appointments' && <SpecialistAppointments />}
      {activeTab === 'services' && <SpecialistServices />}
      {activeTab === 'reviews' && <SpecialistReviews />}
    </div>
  );
};

export default SpecialistDashboard;
