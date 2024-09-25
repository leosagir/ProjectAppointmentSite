import React, { useEffect, useState } from 'react';
import HeroSection from '../components/Home/HeroSection';
import ServicesList from '../components/Home/ServiceList';
import './Home.css';

const Home: React.FC = () => {

  return (
    <div className="home-page">
      <HeroSection />
      
      <section className="welcome-section">
        <h2>Добро пожаловать в нашу стоматологическую клинику</h2>
        <p>Мы предоставляем высококачественные стоматологические услуги для всей семьи. Наша миссия - сделать вашу улыбку здоровой и красивой.</p>
      </section>
      
      <ServicesList />
      
      <section className="why-choose-us">
        <h2>Почему выбирают нас</h2>
        <ul>
          <li>Опытные специалисты с многолетним стажем</li>
          <li>Современное оборудование и передовые технологии</li>
          <li>Индивидуальный подход к каждому пациенту</li>
          <li>Комфортная и дружелюбная атмосфера</li>
          <li>Доступные цены и гибкая система скидок</li>
        </ul>
      </section>
      
      <section className="testimonials">
        <h2>Отзывы наших пациентов</h2>
        <div className="testimonial">
          <p>"Прекрасная клиника! Профессиональный подход и внимательное отношение к пациентам."</p>
          - Анна С.
        </div>
        <div className="testimonial">
          <p>"Благодаря команде этой клиники, я больше не боюсь посещать стоматолога. Спасибо за вашу работу!"</p>
          - Михаил Д.
        </div>
      </section>
    </div>
  );
};

export default Home;