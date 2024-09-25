import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchNotifications } from '../../store/slices/notificationsSlice';

const NotificationManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div>
      <h2>Управление уведомлениями</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>
            {notification.clientFullName} - {notification.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationManagement;