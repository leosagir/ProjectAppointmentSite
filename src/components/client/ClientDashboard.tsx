import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Routes, Link as RouterLink, useLocation, Navigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { fetchCurrentClient } from '../../store/slices/clientSlice';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EventIcon from '@mui/icons-material/Event';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';

import ClientInfo from './ClientInfo';
import ClientAppointments from './ClientAppointments';
import ClientReviews from './ClientReview';
import ClientNotifications from './ClientNotifications';
import { ClientResponseDto } from '../../types/client';

const drawerWidth = 240;

const menuItems = [
  { text: 'Meine Termine', icon: <EventIcon />, path: 'appointments' },
  { text: 'Meine Informationen', icon: <PersonIcon />, path: 'info' },
  { text: 'Meine Bewertungen', icon: <RateReviewIcon />, path: 'reviews' },
  { text: 'Benachrichtigungen', icon: <NotificationsIcon />, path: 'notifications' },
];

const ClientDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const client = useSelector((state: RootState) => state.clients.currentClient as ClientResponseDto | null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchCurrentClient());
  }, [dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          Patientenbereich
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname.endsWith(item.path)}
            onClick={() => isMobile && handleDrawerToggle()}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ 
      paddingTop: '64px',
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1,
        overflow: 'hidden'
      }}>
        <Box
          component="nav"
          sx={{ 
            width: { sm: drawerWidth }, 
            flexShrink: { sm: 0 },
            display: { xs: 'none', sm: 'block' }
          }}
        >
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                position: 'relative',
                height: '100%'
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            height: '100%',
            overflow: 'auto'
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mb: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h4" component="h1" gutterBottom>
            Willkommen, {client?.firstName} {client?.lastName}!
          </Typography>
          <Routes>
            <Route index element={<Navigate to="appointments" replace />} />
            <Route path="appointments" element={<ClientAppointments />} />
            <Route path="info" element={<ClientInfo />} />
            <Route path="reviews" element={<ClientReviews />} />
            <Route path="notifications" element={<ClientNotifications />} />
          </Routes>
        </Box>
      </Box>
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default ClientDashboard;