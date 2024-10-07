import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  Box,
  Container,
  Modal,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { openLoginModal, openRegistrationModal, logout } from '../../store/slices/authSlice';
import LoginForm from '../auth/LoginForm';
import RegistrationForm from '../auth/RegistrationForm';
import { UserRole } from '../../types/auth';

const pages = [
  { title: 'Startseite', path: '/' },  
  { title: 'Über uns', path: '/about' },
  { title: 'Blog', path: '/blog' },
  { title: 'Kontakt', path: '/contacts' }
];

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isAuthenticated, user, isLoginModalOpen, isRegistrationModalOpen } = useSelector((state: RootState) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginClick = () => {
    dispatch(openLoginModal());
  };

  const handleRegisterClick = () => {
    dispatch(openRegistrationModal());
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case UserRole.ADMINISTRATOR:
        return '/admin';
      case UserRole.SPECIALIST:
        return '/specialist-dashboard';
      case UserRole.CLIENT:
        return '/client-dashboard';
      default:
        return '/';
    }
  };

  const getDashboardLinkText = () => {
    if (!user) return 'Mein Konto';
    switch (user.role) {
      case UserRole.ADMINISTRATOR:
        return 'Admin-Panel';
      case UserRole.SPECIALIST:
        return 'Ärzte-Portal';
      case UserRole.CLIENT:
        return 'Mein Konto';
      default:
        return 'Mein Konto';
    }
  };

  const dashboardLink = getDashboardLink();
  const dashboardLinkText = getDashboardLinkText();

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        ZahnKlinik
      </Typography>
      <List>
        {pages.map((page) => (
          <ListItem key={page.title} component={RouterLink} to={page.path}>
            <ListItemText primary={page.title} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem component={RouterLink} to={dashboardLink}>
            <ListItemText primary={dashboardLinkText} />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ZahnKlinik
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
          
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ZahnKlinik
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {isAuthenticated && user ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to={dashboardLink}
                  sx={{ mr: 2 }}
                >
                  {dashboardLinkText}
                </Button>
                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                  {user.email[0].toUpperCase()}
                </Avatar>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Button color="inherit" onClick={handleMenuOpen}>
                  Profil
                </Button>
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem component={RouterLink} to={dashboardLink} onClick={handleMenuClose}>
                  {dashboardLinkText}
                </MenuItem>
                <MenuItem onClick={handleLogout}>Abmelden</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleLoginClick} sx={{ mr: 1 }}>
                Anmelden
              </Button>
              <Button color="inherit" onClick={handleRegisterClick}>
                Registrieren
              </Button>
            </>
          )}
        </Toolbar>
      </Container>

      <Modal
        open={isLoginModalOpen}
        onClose={() => dispatch({ type: 'auth/closeLoginModal' })}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <LoginForm />
        </Box>
      </Modal>

      <Modal
        open={isRegistrationModalOpen}
        onClose={() => dispatch({ type: 'auth/closeRegistrationModal' })}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <RegistrationForm />
        </Box>
      </Modal>
    </AppBar>
  );
};

export default Header;