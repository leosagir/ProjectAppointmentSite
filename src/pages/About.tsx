import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  CheckCircleOutline
} from '@mui/icons-material';
import { 
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  timelineItemClasses
} from '@mui/lab';
import { AppDispatch, RootState } from '../store/store';
import { fetchSpecialists, selectAllSpecialists } from '../store/slices/specialistSlice';
import { SpecialistResponseDto } from '../types/specialists';
import { UserRole } from '../types/auth';
import { openLoginModal, openRegistrationModal } from '../store/slices/authSlice';

const specialistPhotos: { [key: number]: string } = {
  1: '/doctor2.jpeg',
  2: '/doctor1.jpg',
  3: '/doctor3.jpeg',
  4: '/doctor5.jpeg',
  5: '/doctor4.jpeg',
  6: '/doctor6.jpeg',
  7: '/doctor7.jpeg',
};

const historyEvents = [
  { year: 2010, event: 'Gründung der ZahnKlinik' },
  { year: 2015, event: 'Eröffnung der zweiten Filiale' },
  { year: 2018, event: 'Einführung innovativer Behandlungstechnologien' },
  { year: 2022, event: 'Auszeichnung als beste Zahnklinik der Stadt' },
];

const advantages = [
  "Modernste Technologien und Ausrüstung",
  "Erfahrenes Team von Spezialisten",
  "Individuelle Behandlungspläne",
  "Schmerzfreie Behandlungsmethoden",
  "Flexible Terminplanung",
  "Komfortable und entspannte Atmosphäre"
];

const testimonials = [
  { name: "Maria S.", text: "Ich hatte immer Angst vor Zahnärzten, aber hier fühle ich mich wohl und sicher." },
  { name: "Thomas H.", text: "Die Qualität der Behandlung ist erstklassig. Ich kann ZahnKlinik nur empfehlen!" },
  { name: "Laura M.", text: "Endlich habe ich das Lächeln, von dem ich immer geträumt habe. Vielen Dank!" }
];

const About: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const specialists = useSelector(selectAllSpecialists);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    dispatch(fetchSpecialists());
  }, [dispatch]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === specialists.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? specialists.length - 1 : prevIndex - 1
    );
  };

  const handleAppointment = (specialistId: number) => {
    if (isAuthenticated && user?.role === UserRole.CLIENT) {
      navigate(`/client-dashboard/appointments?specialistId=${specialistId}`);
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

  return (
    <Box sx={{ paddingTop: '64px' }}>
      <Container sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Willkommen bei ZahnKlinik
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Ihr Partner für ein gesundes und strahlendes Lächeln
        </Typography>
        <Typography variant="body1" paragraph>
          ZahnKlinik ist eine moderne Zahnklinik, die ein umfassendes Spektrum an Dienstleistungen 
          für Ihr Lächeln anbietet. Unsere Mission ist es, qualitativ hochwertige zahnmedizinische 
          Versorgung für jeden zugänglich zu machen. Mit modernster Technologie und einem 
          erfahrenen Team von Spezialisten bieten wir Ihnen die bestmögliche Behandlung in 
          einer komfortablen und entspannten Atmosphäre.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 4 }}>
          Unser Team von Experten
        </Typography>
        <Box sx={{ position: 'relative', height: isLargeScreen ? 500 : 400, overflow: 'hidden', mb: 6 }}>
          {specialists.map((specialist: SpecialistResponseDto, index: number) => (
            <Card
              key={specialist.id}
              sx={{
                position: 'absolute',
                top: 0,
                left: '50%',
                width: isLargeScreen ? '300px' : '250px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.5s ease-in-out',
                transform: `translateX(${110 * (index - currentIndex)}%) translateX(-50%)`,
              }}
            >
              <Box sx={{ position: 'relative', height: '80%' }}>
                <CardMedia
                  component="img"
                  sx={{
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  image={specialistPhotos[specialist.id] || '/default-doctor.jpg'}
                  alt={`${specialist.firstName} ${specialist.lastName}`}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    padding: '10px',
                  }}
                >
                  <Typography variant="h6">
                    {`${specialist.firstName} ${specialist.lastName}`}
                  </Typography>
                  <Typography variant="body2">
                    {specialist.specializations.map(spec => spec.title).join(', ')}
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                p: 2 
              }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleAppointment(specialist.id)}
                >
                  Termin vereinbaren
                </Button>
              </CardContent>
            </Card>
          ))}
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              top: '50%',
              left: 20,
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 20,
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
          <Box sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}>
            {specialists.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: index === currentIndex ? 'primary.main' : 'grey.400',
                  transition: 'background-color 0.3s',
                  cursor: 'pointer',
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>
        </Box>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Unsere Vorteile</Typography>
              <List>
                {advantages.map((advantage, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleOutline color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={advantage} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Was unsere Patienten sagen</Typography>
              {testimonials.map((testimonial, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1" paragraph>"{testimonial.text}"</Typography>
                  <Typography variant="subtitle2" align="right">- {testimonial.name}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6 }}>
          Unsere Geschichte
        </Typography>
        <Typography variant="body1" paragraph>
          Seit unserer Gründung im Jahr 2010 haben wir uns kontinuierlich weiterentwickelt, 
          um Ihnen die beste zahnmedizinische Versorgung zu bieten. Hier sind einige wichtige 
          Meilensteine auf unserem Weg:
        </Typography>
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {historyEvents.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {index !== historyEvents.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6" component="span">
                  {event.year}
                </Typography>
                <Typography>{event.event}</Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Bereit für Ihr strahlendes Lächeln?</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => handleAppointment(0)}
            sx={{ mt: 2 }}
          >
            Jetzt Termin vereinbaren
          </Button>
        </Box>
      </Container>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
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
    </Box>
  );
};

export default About;