import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link,
  IconButton
} from '@mui/material';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Über uns
            </Typography>
            <Typography variant="body2">
              ZahnKlinik - eine moderne Zahnklinik, 
              die ein umfassendes Spektrum an Dienstleistungen für Ihr Lächeln anbietet.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Kontakt
            </Typography>
            <Typography variant="body2">
              Adresse: Musterstraße 123, 12345 Berlin
            </Typography>
            <Typography variant="body2">
              Telefon: +49 (123) 456-78-90
            </Typography>
            <Typography variant="body2">
              E-Mail: info@zahnklinik.de
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Folgen Sie uns
            </Typography>
            <IconButton color="inherit" aria-label="Facebook">
              <Facebook />
            </IconButton>
            <IconButton color="inherit" aria-label="Instagram">
              <Instagram />
            </IconButton>
            <IconButton color="inherit" aria-label="Twitter">
              <Twitter />
            </IconButton>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" align="center">
            {'Copyright © '}
            <Link color="inherit" component={RouterLink} to="/">
              ZahnKlinik
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;