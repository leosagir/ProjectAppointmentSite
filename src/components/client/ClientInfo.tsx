import React from 'react';
import { ClientResponseDto } from '../../types/client';

interface ClientInfoProps {
  client: ClientResponseDto | null;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ client }) => {
  if (!client) return <div>Загрузка информации о клиенте...</div>;

  return (
    <div>
      <h2>Информация о клиенте</h2>
      <p>Имя: {client.firstName} {client.lastName}</p>
      <p>Email: {client.email}</p>
      <p>Телефон: {client.phone}</p>
      <p>Адрес: {client.address}</p>
      <p>Дата рождения: {client.dateOfBirth}</p>
    </div>
  );
};

export default ClientInfo;