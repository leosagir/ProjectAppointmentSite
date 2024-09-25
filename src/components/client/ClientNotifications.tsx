import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchNotifications } from '../../store/slices/notificationsSlice';
import { NotificationResponseDto } from '../../types/notification';

const ClientNotifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notifications.clientNotifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div>
      <h2>Мои уведомления</h2>
      {notifications.length === 0 ? (
        <p>У вас нет новых уведомлений.</p>
      ) : (
        <ul>
          {notifications.map((notification: NotificationResponseDto) => (
            <li key={notification.id}>
              {notification.appointmentDate} - {notification.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientNotifications;