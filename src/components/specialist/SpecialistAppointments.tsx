import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchAppointments } from '../../store/slices/appointmentsSlice';
import { AppointmentResponseDto } from '../../types/appointment';

const SpecialistAppointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appointments = useSelector((state: RootState) => state.appointments.specialistAppointments);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  return (
    <div>
      <h2>Мои записи</h2>
      {appointments.length === 0 ? (
        <p>У вас нет предстоящих записей.</p>
      ) : (
        <ul>
          {appointments.map((appointment: AppointmentResponseDto) => (
            <li key={appointment.id}>
              {appointment.clientName} - {appointment.serviceName} ({appointment.startTime})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SpecialistAppointments;