import React from "react";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { UserRole, User } from '../../types/auth';
import { openLoginModal, openRegistrationModal, logout } from '../../store/slices/authSlice';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated, isLoginModalOpen, isRegistrationModalOpen } = useSelector((state: RootState) => state.auth);

    console.log('Header rendering:', { 
        isAuthenticated, 
        user: user ? { ...user, password: '[REDACTED]' } : null,
        isLoginModalOpen,
        isRegistrationModalOpen,
        isAdminLinkVisible: isAuthenticated && user && user.role === UserRole.ADMINISTRATOR 
    });

    const handleLogout = () => {
        console.log('Logout clicked');
        dispatch(logout());
    };

    const handleLoginClick = () => {
        console.log('Login button clicked');
        dispatch(openLoginModal());
    };

    const handleRegisterClick = () => {
        console.log('Register button clicked');
        dispatch(openRegistrationModal());
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}><Link to="/" className={styles.navLink}>Главная</Link></li>
                    <li className={styles.navItem}><Link to="/about" className={styles.navLink}>О нас</Link></li>
                    <li className={styles.navItem}><Link to="/services" className={styles.navLink}>Услуги</Link></li>
                    <li className={styles.navItem}><Link to="/specialists" className={styles.navLink}>Специалисты</Link></li>
                    <li className={styles.navItem}><Link to="/appointment" className={styles.navLink}>Записаться</Link></li>
                    {isAuthenticated && user && user.role === UserRole.CLIENT && (
                        <li className={styles.navItem}><Link to="/client-dashboard" className={styles.navLink}>Личный кабинет</Link></li>
                    )}
                    {isAuthenticated && user && user.role === UserRole.ADMINISTRATOR && (
    <li className={styles.navItem}><Link to="/admin" className={styles.navLink}>Панель администратора</Link></li>
)}
                </ul>
                {isAuthenticated && user ? (
                    <div className={styles.userInfo}>
                        <span>Привет, {user.email}!</span>
                        <button className={styles.logoutButton} onClick={handleLogout}>Выйти</button>
                    </div>
                ) : (
                    <div className={styles.authButtons}>
                        <button className={`${styles.authButton} ${styles.loginButton}`} onClick={() => dispatch(openLoginModal())}>Войти</button>
                        <button className={`${styles.authButton} ${styles.registerButton}`} onClick={() => dispatch(openRegistrationModal())}>Регистрация</button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;