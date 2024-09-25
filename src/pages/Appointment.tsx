import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Appointment.css';

const Appointment: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const serviceId = searchParams.get('service');
    if (serviceId) {
      setSelectedService(serviceId);
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки данных на сервер
    console.log('Форма отправлена', { name, phone, email, selectedService, date });
    // Очистка формы после отправки
    setName('');
    setPhone('');
    setEmail('');
    setSelectedService('');
    setDate('');
  };

  return (
    <div className="appointment-page">
      <h1>Запись на прием</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Имя:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Телефон:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="service">Услуга:</label>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
          >
            <option value="">Выберите услугу</option>
            <option value="1">Профессиональная чистка зубов</option>
            <option value="2">Лечение кариеса</option>
            <option value="3">Отбеливание зубов</option>
            <option value="4">Установка брекетов</option>
            <option value="5">Имплантация зубов</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date">Дата:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Записаться</button>
      </form>
    </div>
  );
};

export default Appointment;