import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchServices, createService, updateService, deleteService } from '../../store/slices/servicesSlice';
import { ServiceResponseDto, ServiceRequestDto, ServiceUpdateDto } from '../../types/services';
import styles from './ServiceManagement.module.css';

const ServiceManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector((state: RootState) => state.services.services);
  const [selectedService, setSelectedService] = useState<ServiceResponseDto | null>(null);
  const [formData, setFormData] = useState<ServiceRequestDto>({
    title: '',
    description: '',
    duration: 0,
    price: '',
    specializationId: 0,
  });

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService) {
      dispatch(updateService({ id: selectedService.id, data: formData as ServiceUpdateDto }));
    } else {
      dispatch(createService(formData));
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту услугу?')) {
      dispatch(deleteService(id));
    }
  };

  const resetForm = () => {
    setSelectedService(null);
    setFormData({
      title: '',
      description: '',
      duration: 0,
      price: '',
      specializationId: 0,
    });
  };

  return (
    <div className={styles.serviceManagement}>
      <h2>Управление услугами</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Название услуги"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Описание услуги"
          required
        />
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleInputChange}
          placeholder="Длительность (в минутах)"
          required
        />
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Цена"
          required
        />
        <input
          type="number"
          name="specializationId"
          value={formData.specializationId}
          onChange={handleInputChange}
          placeholder="ID специализации"
          required
        />
        <button type="submit">{selectedService ? 'Обновить' : 'Создать'}</button>
        {selectedService && <button type="button" onClick={resetForm}>Отмена</button>}
      </form>
      <ul className={styles.serviceList}>
        {services.map((service) => (
          <li key={service.id} className={styles.serviceItem}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <span>Длительность: {service.duration} мин</span>
            <span>Цена: {service.price}</span>
            <div>
              <button onClick={() => setSelectedService(service)}>Редактировать</button>
              <button onClick={() => handleDelete(service.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceManagement;