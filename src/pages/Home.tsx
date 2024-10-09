import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Container, Typography, Button, Grid, Card, CardContent, 
  CardMedia, CardActions, Avatar, Rating, IconButton, Dialog, 
  DialogActions, DialogContent, DialogContentText, DialogTitle, 
  useTheme, useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  MedicalServices, AccessTime, AttachMoney, EmojiEmotions, 
  ArrowBackIos, ArrowForwardIos 
} from '@mui/icons-material';

import { AppDispatch, RootState } from '../store/store';
import { fetchSpecializations, selectAllSpecializations } from '../store/slices/specializationsSlice';
import { SpecializationResponseDto } from '../types/specialization';
import { ServiceShortDto } from '../types/services';
import { UserRole } from '../types/auth';
import { openLoginModal, openRegistrationModal } from '../store/slices/authSlice';

// Import images
import HeroImage from '../assets/welcoming-medical-waiting-area.jpg';
import aestheticDentistryImage from '../assets/Ästhetische Zahnheilkunde2.jpg';
import prostheticsImage from '../assets/Prothetik2.jpg';
import implantologyImage from '../assets/Implantologie2.jpg';
import endodontologyImage from '../assets/Endodontologie.jpeg';
import paradontologieImage from '../assets/Parodontologie2.jpg';
import kieferortpedieImage from '../assets/Kieferorthopädie.jpeg';
import defaultSpecializationImage from '../assets/default-specialization.jpeg';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  height: '80vh',
  display: 'flex',
  alignItems: 'center',
  backgroundImage: `url(${HeroImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: theme.palette.common.white,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
}));

const HeroContent = styled(Box)({
  position: 'relative',
  zIndex: 1,
});

// Constants
const reviews = [
  { id: 1, name: 'Anna S.', rating: 5, text: 'Ausgezeichnete Klinik! Professioneller Ansatz und aufmerksame Betreuung.' },
  { id: 2, name: 'Hans M.', rating: 4, text: 'Zufrieden mit dem Behandlungsergebnis. Ich empfehle es allen.' },
  { id: 3, name: 'Emma W.', rating: 5, text: 'Schmerzlose Behandlung und angenehme Atmosphäre. Vielen Dank!' },
];

const reasons = [
  { id: 1, icon: <MedicalServices />, title: 'Moderne Ausstattung', description: 'Wir verwenden fortschrittliche Technologien' },
  { id: 2, icon: <AccessTime />, title: 'Flexible Öffnungszeiten', description: 'Wir arbeiten auch an Wochenenden' },
  { id: 3, icon: <AttachMoney />, title: 'Faire Preise', description: 'Flexibles Rabattsystem' },
  { id: 4, icon: <EmojiEmotions />, title: 'Patientenbetreuung', description: 'Individueller Ansatz für jeden Patienten' },
];

const specializationImages: { [key: number]: string } = {
  9: aestheticDentistryImage,
  8: prostheticsImage,
  6: implantologyImage,
  7: endodontologyImage,
  4: paradontologieImage,
  5: kieferortpedieImage,
};

// SpecializationCard component
const SpecializationCard: React.FC<{
  specialization: SpecializationResponseDto;
  onClick: () => void;
}> = ({ specialization, onClick }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const cardSize = isLargeScreen ? 300 : 200; // Card size in pixels

  return (
    <Card
      sx={{
        width: cardSize,
        height: cardSize + 100, // Add 100px for content
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        sx={{
          width: cardSize,
          height: cardSize,
          objectFit: 'cover',
        }}
        image={specializationImages[specialization.id] || defaultSpecializationImage}
        alt={specialization.title}
      />
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {specialization.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Mehr erfahren
        </Typography>
      </CardContent>
    </Card>
  );
};

// Main component
const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const specializations = useSelector(selectAllSpecializations);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<SpecializationResponseDto | null>(null);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    dispatch(fetchSpecializations());
  }, [dispatch]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === specializations.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? specializations.length - 1 : prevIndex - 1
    );
  };

  const handleAppointment = (specializationId?: number) => {
    if (isAuthenticated && user?.role === UserRole.CLIENT) {
      navigate(specializationId 
        ? `/client-dashboard/appointments?specializationId=${specializationId}`
        : '/client-dashboard/appointments'
      );
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleLogin = () => {
    setIsDialogOpen(false);
    dispatch(openLoginModal());
  };

  const handleRegister = () => {
    setIsDialogOpen(false);
    dispatch(openRegistrationModal());
  };

  const handleSpecializationClick = (specialization: SpecializationResponseDto) => {
    setSelectedSpecialization(specialization);
  };

  return (
    <Box sx={{ paddingTop: '64px' }}>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <HeroContent>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h1" component="h1" gutterBottom>
                  Ihr Lächeln ist unsere Sorge
                </Typography>
                <Typography variant="h5" paragraph>
                  Moderne Zahnmedizin mit Fürsorge für jeden Patienten
                </Typography>
                <Button variant="contained" color="primary" size="large" onClick={() => handleAppointment()}>
                  Termin vereinbaren
                </Button>
              </Grid>
            </Grid>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Specializations Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h2" component="h2" align="center" gutterBottom>
          Unsere Spezialisierungen
        </Typography>
        <Box sx={{ position: 'relative', height: isLargeScreen ? 500 : 400, overflow: 'hidden' }}>
          {specializations.map((specialization: SpecializationResponseDto, index: number) => (
            <Box
              key={specialization.id}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transition: 'transform 0.5s ease-in-out',
                transform: `translateX(${110 * (index - currentIndex)}%) translateX(-50%) translateY(-50%)`,
              }}
            >
              <SpecializationCard
                specialization={specialization}
                onClick={() => handleSpecializationClick(specialization)}
              />
            </Box>
          ))}
          <IconButton 
            onClick={prevSlide} 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: 20, 
              transform: 'translateY(-50%)', 
              backgroundColor: 'rgba(255, 255, 255, 0.7)', 
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } 
            }}
          >
            <ArrowBackIos />
          </IconButton>
          <IconButton 
            onClick={nextSlide} 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              right: 20, 
              transform: 'translateY(-50%)', 
              backgroundColor: 'rgba(255, 255, 255, 0.7)', 
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } 
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" size="large" onClick={() => handleAppointment()}>
            Termin vereinbaren
          </Button>
        </Box>
      </Container>

      {/* Reviews Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography variant="h2" component="h2" align="center" gutterBottom>
            Bewertungen unserer Patienten
          </Typography>
          <Grid container spacing={4}>
            {reviews.map((review) => (
              <Grid item key={review.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{review.name[0]}</Avatar>
                      <Typography variant="h6">{review.name}</Typography>
                    </Box>
                    <Rating value={review.rating} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      {review.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Reasons Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h2" component="h2" align="center" gutterBottom>
          Warum uns wählen
        </Typography>
        <Grid container spacing={4}>
          {reasons.map((reason) => (
            <Grid item key={reason.id} xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2, color: 'primary.main' }}>{reason.icon}</Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {reason.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reason.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Final Appointment Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={() => handleAppointment()}>
          Termin vereinbaren
        </Button>
      </Box>

      {/* Dialogs */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Termin vereinbaren</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Um einen Termin zu vereinbaren, müssen Sie sich anmelden oder registrieren.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin}>Anmelden</Button>
          <Button onClick={handleRegister}>Registrieren</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedSpecialization} onClose={() => setSelectedSpecialization(null)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedSpecialization?.title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {selectedSpecialization?.services.map((service: ServiceShortDto) => (
              <Grid item key={service.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dauer: {service.duration} Min.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Preis: {service.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSpecialization(null)}>Schließen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;