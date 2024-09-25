import React from 'react';
import './Specialist.css'
import photo1 from "../assets/_b5a21d3e-b1f3-4cab-8d9f-65bd2c56fb3c.jpeg"
import photo2 from "../../src/assets/СтоматологЖенщина.jpeg"
import photo3 from "../../src/assets/_31df279f-ddfe-4b0f-acd5-0f3dab67b098.jpeg"

interface Specialist {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  education: string;
  photoUrl: string;
}

const specialistsList: Specialist[] = [
  {
    id: 1,
    name: "Иванов Иван Иванович",
    specialty: "Главный стоматолог",
    experience: "15 лет",
    education: "Киевский государственный медико-стоматологический университет",
    photoUrl: photo3
  },
  {
    id: 2,
    name: "Петрова Мария Сергеевна",
    specialty: "Ортодонт",
    experience: "10 лет",
    education: "Днепровский государственный медицинский университет",
    photoUrl: photo2
  },
  {
    id: 3,
    name: "Сидоров Алексей Петрович",
    specialty: "Хирург-имплантолог",
    experience: "12 лет",
    education: "Одесский государственный медицинский университет",
    photoUrl: photo1
  }
];

const Specialists: React.FC = () => {
  return (
    <div className="specialists-page">
      <h1>Наши специалисты</h1>
      <div className="specialists-list">
        {specialistsList.map((specialist) => (
          <div key={specialist.id} className="specialist-card">
            <img src={specialist.photoUrl} alt={specialist.name} className="specialist-photo" />
            <h2>{specialist.name}</h2>
            <p className="specialist-specialty">{specialist.specialty}</p>
            <p>Опыт работы: {specialist.experience}</p>
            <p>Образование: {specialist.education}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Specialists;