import React from "react";
import {Link} from 'react-router-dom';
import "./HeroSection.css"
import patientImage from "../../assets/счастливый пациент.jpeg";

const HeroSection:React.FC = () =>{
    return (
        <section className="hero-section">
            <div className="hero-content">
                <h1>Ваша улыбка . наша забота</h1>
                <p>Профессиональная стоматологическая помощь для всей семьи</p>
                <Link to="/appointment" className="cta-button">
                Записаться на приём
                </Link>
            </div>
            <div className="hero-image">
            
                <img src= {patientImage} alt="Счастливый пациент" />
            </div>
        </section>
    );        
};

export default HeroSection;
