import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  fetchAppointments,
  updateAppointment,
  deleteAppointment,
} from "../../store/slices/appointmentsSlice";
import {
  AppointmentResponseDto,
  AppointmentUpdateDto,
} from "../../types/appointment";
import styles from "./AppointmentManagement.module.css";
import { AppointmentStatus } from "../../types/enum";

const AppointmentManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponseDto | null>(null);
  const [formData, setFormData] = useState<AppointmentUpdateDto>({
    specialistId: 0,
    clientId: 0,
    serviceId: 0,
    startTime: "",
    endTime: "",
    appointmentStatus: AppointmentStatus.BOOKED,
  });

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAppointment) {
      dispatch(
        updateAppointment({ id: selectedAppointment.id, data: formData })
      );
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
      dispatch(deleteAppointment(id));
    }
  };

  const resetForm = () => {
    setSelectedAppointment(null);
    setFormData({
      specialistId: 0,
      clientId: 0,
      serviceId: 0,
      startTime: "",
      endTime: "",
      appointmentStatus: AppointmentStatus.BOOKED,
    });
  };

  return (
    <div className={styles.appointmentManagement}>
      <h2>Управление записями</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="number"
          name="specialistId"
          value={formData.specialistId}
          onChange={handleInputChange}
          placeholder="ID специалиста"
          required
        />
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
          name="serviceId"
          value={formData.serviceId}
          onChange={handleInputChange}
          placeholder="ID услуги"
          required
        />
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleInputChange}
          required
        />
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleInputChange}
          required
        />
        <select
          name="appointmentStatus"
          value={formData.appointmentStatus}
          onChange={handleInputChange}
          required
        >
          <option value="BOOKED">Забронировано</option>
          <option value="COMPLETED">Завершено</option>
          <option value="CANCELLED">Отменено</option>
        </select>
        <button type="submit">Обновить</button>
        <button type="button" onClick={resetForm}>
          Отмена
        </button>
      </form>
      <ul className={styles.appointmentList}>
        {appointments.map((appointment) => (
          <li key={appointment.id} className={styles.appointmentItem}>
            <span>
              {appointment.clientName} - {appointment.serviceName} (
              {appointment.startTime})
            </span>
            <div>
              <button onClick={() => setSelectedAppointment(appointment)}>
                Редактировать
              </button>
              <button onClick={() => handleDelete(appointment.id)}>
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentManagement;
