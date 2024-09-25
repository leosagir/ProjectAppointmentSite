import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchServices } from '../../store/slices/servicesSlice';
import { ServiceResponseDto } from '../../types/services';

const ServiceList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector((state: RootState) => state.services.services);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <div>
      <h2>Список услуг</h2>
      {services.length === 0 ? (
        <p>Услуги не найдены.</p>
      ) : (
        <ul>
          {services.map((service: ServiceResponseDto) => (
            <li key={service.id}>
              {service.title} - {service.price}
              <p>{service.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServiceList;