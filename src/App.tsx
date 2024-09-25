import React from 'react';
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
import { closeLoginModal, closeRegistrationModal } from './store/slices/authSlice';
import RegistrationForm from './components/auth/RegistrationForm';
import LoginForm from './components/auth/LoginForm';
import Specialists from './pages/Specialist';
import Services from './pages/Services';
import About from './pages/About';
import Appointment from './pages/Appointment';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoginModalOpen, isRegistrationModalOpen } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/specialists" element={<Specialists />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route 
              path="/client-dashboard" 
              element={
                <ProtectedRoute 
                  role={UserRole.CLIENT} 
                  element={<ClientDashboard />} 
                />
              } 
            />
            <Route 
              path="/specialist-dashboard" 
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
                    : <Navigate to="/client-dashboard" />
                } 
              />
            )}
          </Routes>
        </main>
        <Footer />
        <Modal isOpen={isLoginModalOpen} onClose={() => dispatch(closeLoginModal())}>
          <LoginForm />
        </Modal>
        <Modal isOpen={isRegistrationModalOpen} onClose={() => dispatch(closeRegistrationModal())}>
          <RegistrationForm />
        </Modal>
      </div>
    </Router>
  );
};

export default App;