import React from 'react';
import './Services.css';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
}

const servicesList: Service[] = [
  {
    id: 1,
    name: "Профессиональная чистка зубов",
    description: "Удаление зубного камня и налета, полировка зубов для предотвращения кариеса и заболеваний десен.",
    price: "от 100"
  },
  {
    id: 2,
    name: "Лечение кариеса",
    description: "Удаление пораженных тканей зуба и восстановление его формы и функции с помощью современных пломбировочных материалов.",
    price: "от 150"
  },
  {
    id: 3,
    name: "Отбеливание зубов",
    description: "Процедура, направленная на осветление цвета зубной эмали для достижения более привлекательной улыбки.",
    price: "от 250"
  },
  {
    id: 4,
    name: "Установка брекетов",
    description: "Исправление прикуса и выравнивание зубов с помощью ортодонтических конструкций.",
    price: "от 3000" 
      },
  {
    id: 5,
    name: "Имплантация зубов",
    description: "Установка искусственных корней зубов для последующего протезирования.",
    price: "от 2000"
  }
];

const Services: React.FC = () => {
  return (
    <div className="services-page">
      <h1>Наши услуги</h1>
      <p className="services-intro">
        Мы предлагаем широкий спектр стоматологических услуг для поддержания здоровья и красоты вашей улыбки. Наши специалисты используют современное оборудование и передовые методики лечения.
      </p>
      <div className="services-list">
        {servicesList.map((service) => (
          <div key={service.id} className="service-item">
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <p className="service-price">Стоимость: {service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;