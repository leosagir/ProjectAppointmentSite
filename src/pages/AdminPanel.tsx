import React, { useState } from 'react';
import { Route, Routes, Link as RouterLink, useLocation } from 'react-router-dom';
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
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import RateReviewIcon from '@mui/icons-material/RateReview';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CategoryIcon from '@mui/icons-material/Category';

import SpecialistManagement from '../components/adminPanel/SpecialistManagement';
import AppointmentManagement from '../components/adminPanel/AppointmentManagement';
import ClientManagement from '../components/adminPanel/ClientManagement';
import AdminManagement from '../components/adminPanel/AdminManagement';
import ReviewManagement from '../components/adminPanel/ReviewManagement';
import NotificationManagement from '../components/adminPanel/NotificationManagement';
import ServiceManagement from '../components/adminPanel/ServiceManagement';
import SpecializationManagement from '../components/adminPanel/SpecialisationManagement';

const drawerWidth = 240;

const menuItems = [
  { text: 'Verwaltung der Spezialisten', icon: <PeopleIcon />, path: '/admin/specialists' },
  { text: 'Terminverwaltung', icon: <EventIcon />, path: '/admin/appointments' },
  { text: 'Kundenverwaltung', icon: <PersonIcon />, path: '/admin/clients' },
  { text: 'Administratorenverwaltung', icon: <AdminPanelSettingsIcon />, path: '/admin/admins' },
  { text: 'Bewertungsverwaltung', icon: <RateReviewIcon />, path: '/admin/reviews' },
  { text: 'Dienstverwaltung', icon: <MedicalServicesIcon />, path: '/admin/services' },
  { text: 'Spezialisierungsverwaltung', icon: <CategoryIcon />, path: '/admin/specializations' },
];

const AdminPanel: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          Administratorbereich
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
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
      paddingTop: '84px',
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
              aria-label="Menü öffnen"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mb: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Routes>
            <Route path="specialists" element={<SpecialistManagement />} />
            <Route path="appointments" element={<AppointmentManagement />} />
            <Route path="clients" element={<ClientManagement />} />
            <Route path="admins" element={<AdminManagement />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="specializations" element={<SpecializationManagement />} />
          </Routes>
        </Box>
      </Box>
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Bessere Öffnungsleistung auf Mobilgeräten.
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

export default AdminPanel;