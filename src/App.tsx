import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import ClientDashboard from './components/client/ClientDashboard';
import SpecialistDashboard from './components/specialist/SpecialistDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AppDispatch, RootState } from './store/store';
import { UserRole } from './types/auth';
import Modal from './components/Modal/Modal';
import { closeLoginModal, closeRegistrationModal, loadUser } from './store/slices/authSlice';
import RegistrationForm from './components/auth/RegistrationForm';
import LoginForm from './components/auth/LoginForm';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';

import { Box } from '@mui/material';
import { tokenManager } from './utils/tokenManager';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoginModalOpen, isRegistrationModalOpen } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = tokenManager.getAccessToken();
    if (token && !tokenManager.isTokenExpired(token)) {
      dispatch(loadUser());
    }
  }, [dispatch])

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/blog" element={<Blog/>} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route 
              path="/client-dashboard/*" 
              element={
                <ProtectedRoute 
                  role={UserRole.CLIENT} 
                  element={<ClientDashboard />} 
                />
              } 
            />
            <Route 
              path="/specialist-dashboard/*" 
              element={
                <ProtectedRoute 
                  role={UserRole.SPECIALIST} 
                  element={<SpecialistDashboard />} 
                />
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute 
                  role={UserRole.ADMINISTRATOR} 
                  element={<AdminPanel />} 
                />
              } 
            />
            {isAuthenticated && (
              <Route 
                path="/dashboard" 
                element={
                  user?.role === UserRole.ADMINISTRATOR 
                    ? <Navigate to="/admin" />
                    : user?.role === UserRole.SPECIALIST
                    ? <Navigate to="/specialist-dashboard" />
                    : <Navigate to="/client-dashboard/appointments" />
                } 
              />
            )}
          </Routes>
        </Box>
        <Footer />
        <Modal isOpen={isLoginModalOpen} onClose={() => dispatch(closeLoginModal())}>
          <LoginForm />
        </Modal>
        <Modal isOpen={isRegistrationModalOpen} onClose={() => dispatch(closeRegistrationModal())}>
          <RegistrationForm />
        </Modal>
      </Box>
    </Router>
  );
};

export default App;