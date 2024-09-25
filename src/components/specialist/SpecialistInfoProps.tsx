import React from 'react';
import { SpecialistResponseDto } from '../../types/specialists';

interface SpecialistInfoProps {
  specialist: SpecialistResponseDto | null;
}

const SpecialistInfo: React.FC<SpecialistInfoProps> = ({ specialist }) => {
  if (!specialist) return <div>Загрузка информации о специалисте...</div>;

  return (
    <div>
      <h2>Информация о специалисте</h2>
      <p>Имя: {specialist.firstName} {specialist.lastName}</p>
      <p>Email: {specialist.email}</p>
      <p>Телефон: {specialist.phone}</p>
      <p>Адрес: {specialist.address}</p>
      <p>Описание: {specialist.description}</p>
      <h3>Специализации:</h3>
      <ul>
        {specialist.specializations.map(spec => (
          <li key={spec.id}>{spec.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SpecialistInfo;