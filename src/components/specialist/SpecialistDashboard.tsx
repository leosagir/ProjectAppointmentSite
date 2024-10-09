import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Routes, Link as RouterLink, useLocation, Navigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { fetchSpecialists } from '../../store/slices/specialistSlice';
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

import SpecialistInfo from './SpecialistInfo';
import SpecialistAppointments from './SpecialistAppointments';
import SpecialistReviews from './SpecialistReviews';

const drawerWidth = 240;

const menuItems = [
  { text: 'Mein Profil', icon: <PersonIcon />, path: 'info' },
  { text: 'Meine Termine', icon: <EventIcon />, path: 'appointments' },
  { text: 'Patientenbewertungen', icon: <RateReviewIcon />, path: 'reviews' },
];

const SpecialistDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const specialist = useSelector((state: RootState) => state.specialists.currentSpecialist);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchSpecialists());
  }, [dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          Arztportal
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
              aria-label="Menü öffnen"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mb: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Routes>
            <Route index element={<Navigate to="info" replace />} />
            <Route path="info" element={<SpecialistInfo specialist={specialist} />} />
            <Route path="appointments" element={<SpecialistAppointments />} />
            <Route path="reviews" element={<SpecialistReviews />} />
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

export default SpecialistDashboard;