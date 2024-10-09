import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert
} from '@mui/material';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({ name, email, message });
    setOpenSnackbar(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <Box sx={{ paddingTop: '64px' }}>
      <Container sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Kontaktieren Sie uns
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Unsere Kontaktdaten
            </Typography>
            <Typography variant="body1" paragraph>
              Adresse: Musterstraße 123, 12345 Berlin
            </Typography>
            <Typography variant="body1" paragraph>
              Telefon: +49 (123) 456-78-90
            </Typography>
            <Typography variant="body1" paragraph>
              E-Mail: info@zahnklinik.de
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Öffnungszeiten
            </Typography>
            <Typography variant="body1">
              Mo-Fr: 8:00 - 20:00 Uhr
            </Typography>
            <Typography variant="body1">
              Sa: 9:00 - 14:00 Uhr
            </Typography>
            <Typography variant="body1">
              So: Geschlossen
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Schreiben Sie uns
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                fullWidth
                label="E-Mail"
                variant="outlined"
                margin="normal"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                label="Nachricht"
                variant="outlined"
                margin="normal"
                required
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
              >
                Absenden
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Ihre Nachricht wurde erfolgreich gesendet!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;