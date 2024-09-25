import React  from "react";
import './About.css';

const About: React.FC = () => {
    return (
        <div className="about-page">
            <section className="about-intro">
                <h1>О нашей клинике</h1>
                <p>Добро пожаловать в стоматологическую клинику [Название клиники]. Мы предоставляем высококачественные стоматологические услуги с заботой о каждом пациенте.</p>
            </section>

            <section className="our-team">
                <h2>Наша команда</h2>
                <div className="team-memebers">
                    <div className="team-member">
                        <img src="/api/placeholder/150/150" alt="Доктор Иванов" />
                        <h3>Доктор Иванов</h3>
                        <p>Главный стоматолог</p>
                    </div>
                <div className="team-member">
                    <img src="/api/placeholder/150/150" alt="Доктор Петрова"/>
                    <h3>Доктор Петрова</h3>
                    <p>Ортодонт</p>
                </div>
                </div>
            </section>
            <section className="our-values">
                <h2>Наши ценности</h2>
                <ul>
          <li>Профессионализм и постоянное совершенствование</li>
          <li>Индивидуальный подход к каждому пациенту</li>
          <li>Использование современных технологий и материалов</li>
          <li>Создание комфортной и дружелюбной атмосферы</li>
        </ul>
            </section>
        </div>
    );
};

export default About;