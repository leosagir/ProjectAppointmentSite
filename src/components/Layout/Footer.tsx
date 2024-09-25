import React from "react";
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <h3>О нас</h3>
                    <p>Мы предоставляем высококачественные стоматологические услуги для всей семьи.</p>
                </div>
                <div className={styles.footerSection}>
                    <h3>Быстрые ссылки</h3>
                    <ul>
                        <li><Link to="/" className={styles.footerLink}>Главная</Link></li>
                        <li><Link to="/services" className={styles.footerLink}>Услуги</Link></li>
                        <li><Link to="/specialists" className={styles.footerLink}>Специалисты</Link></li>
                        <li><Link to="/appointment" className={styles.footerLink}>Записаться</Link></li>
                    </ul>
                </div>
                <div className={styles.footerSection}>
                    <h3>Контакты</h3>
                    <p>Адрес: ул. Примерная, 123</p>
                    <p>Телефон: +7 (123) 456-78-90</p>
                    <p>Email: info@example.com</p>
                </div>
            </div>
            <div className={styles.copyright}>
                © 2023 Ваша Стоматологическая Клиника. Все права защищены.
            </div>
        </footer>
    );
};

export default Footer;