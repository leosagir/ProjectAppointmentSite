import React from "react";
import './ServicesList.css';


interface Service{
    id: number;
    title: string;
    description: string;
    icon: string;
}

const services: Service[] = [
    {
      id: 1,
      title: "Профилактика",
      description: "Регулярные осмотры и чистка для поддержания здоровья ваших зубов",
      icon: "🦷"
    },
    {
      id: 2,
      title: "Лечение кариеса",
      description: "Современные методы лечения кариеса с использованием качественных материалов",
      icon: "🔬"
    },
    {
      id: 3,
      title: "Отбеливание",
      description: "Профессиональное отбеливание для яркой и красивой улыбки",
      icon: "✨"
    },
    {
      id: 4,
      title: "Имплантация",
      description: "Установка имплантов для восстановления утраченных зубов",
      icon: "🦷"
    }
  ];

const ServiceList: React.FC = () => {
    return (
        <section className="services-list">
            <h2>Наши услуги</h2>
            <div className="services-grid">
                {services.map((service) => (
                    <div key={service.id} className="service-card">
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ServiceList;