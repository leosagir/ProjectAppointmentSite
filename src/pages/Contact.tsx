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
    // Здесь будет логика отправки формы
    console.log({ name, email, message });
    setOpenSnackbar(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <Box>
      <Container sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Свяжитесь с нами
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Наши контакты
            </Typography>
            <Typography variant="body1" paragraph>
              Адрес: ул. Примерная, д. 123, г. Москва
            </Typography>
            <Typography variant="body1" paragraph>
              Телефон: +7 (123) 456-78-90
            </Typography>
            <Typography variant="body1" paragraph>
              Email: info@dentclinic.ru
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Часы работы
            </Typography>
            <Typography variant="body1">
              Пн-Пт: 9:00 - 20:00
            </Typography>
            <Typography variant="body1">
              Сб: 10:00 - 18:00
            </Typography>
            <Typography variant="body1">
              Вс: Выходной
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Напишите нам
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Имя"
                variant="outlined"
                margin="normal"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                label="Сообщение"
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
                Отправить
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
          Ваше сообщение успешно отправлено!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;