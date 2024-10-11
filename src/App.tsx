import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { AppDispatch, RootState } from './store/store';
import { UserRole } from './types/auth';
import { 
  closeLoginModal, 
  closeRegistrationModal, 
  loadUser, 
  clearAuth, 
  refreshTokenThunk 
} from './store/slices/authSlice';
import { tokenManager } from './utils/tokenManager';

// Component imports
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import ClientDashboard from './components/client/ClientDashboard';
import SpecialistDashboard from './components/specialist/SpecialistDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Modal from './components/Modal/Modal';
import RegistrationForm from './components/auth/RegistrationForm';
import LoginForm from './components/auth/LoginForm';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';

// You might want to create a separate file for this
const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
  // Implement your toast logic here
  console.log(`Toast: ${type} - ${message}`);
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    user, 
    isAuthenticated, 
    isLoginModalOpen, 
    isRegistrationModalOpen, 
    error, 
    loading 
  } = useSelector((state: RootState) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenManager.getAccessToken();
      if (token) {
        if (tokenManager.isTokenExpired(token)) {
          console.log('Token expired, attempting to refresh');
          try {
            await dispatch(refreshTokenThunk()).unwrap();
            console.log('Token refreshed successfully');
          } catch (error) {
            console.error('Failed to refresh token:', error);
            dispatch(clearAuth());
            showToast('Your session has expired. Please log in again.', 'error');
          }
        }
        
        if (tokenManager.getAccessToken()) {
          console.log('Valid token found, loading user data');
          try {
            await dispatch(loadUser()).unwrap();
            console.log('User loaded successfully');
          } catch (error) {
            console.error('Failed to load user:', error);
            dispatch(clearAuth());
            showToast('Failed to load user data. Please log in again.', 'error');
          }
        }
      } else {
        console.log('No token found');
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error('Auth error:', error);
      showToast(error, 'error');
    }
  }, [error]);

  if (isInitializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
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
          )}
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