import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchNotifications, createNotification, deleteNotification } from '../../store/slices/notificationsSlice';
import { NotificationResponseDto, NotificationRequestDto } from '../../types/notification';
import styles from './NotificationManagement.module.css';

const NotificationManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const [formData, setFormData] = useState<NotificationRequestDto>({
    clientId: 0,
    appointmentId: 0,
  });

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createNotification(formData));
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это уведомление?')) {
      dispatch(deleteNotification(id));
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: 0,
      appointmentId: 0,
    });
  };

  return (
    <div className={styles.notificationManagement}>
      <h2>Управление уведомлениями</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="number"
          name="clientId"
          value={formData.clientId}
          onChange={handleInputChange}
          placeholder="ID клиента"
          required
        />
        <input
          type="number"
          name="appointmentId"
          value={formData.appointmentId}
          onChange={handleInputChange}
          placeholder="ID записи"
          required
        />
        <button type="submit">Создать уведомление</button>
      </form>
      <ul className={styles.notificationList}>
        {notifications.map((notification) => (
          <li key={notification.id} className={styles.notificationItem}>
            <span>Клиент: {notification.clientFullName}</span>
            <span>Дата записи: {notification.appointmentDate}</span>
            <span>Статус: {notification.status}</span>
            <button onClick={() => handleDelete(notification.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationManagement;