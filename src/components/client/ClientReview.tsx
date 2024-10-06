
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { clientApi } from '../../api/clientApi';
import { ReviewResponseDto, ReviewCreateDto, ReviewUpdateDto } from '../../types/review';
import { AppointmentResponseDto } from '../../types/appointment';
import { fetchClientReviews, selectAllReviews, selectReviewsStatus, selectReviewsError } from '../../store/slices/reviewsSlice';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Rating,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';

const ClientReviews: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector(selectAllReviews);
  const status = useSelector(selectReviewsStatus);
  const error = useSelector(selectReviewsError);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [currentReview, setCurrentReview] = useState<ReviewResponseDto | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewCreateDto>({
    specialistId: 0,
    clientId: 0,
    appointmentId: 0,
    rating: 0,
    comment: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [pastAppointments, setPastAppointments] = useState<AppointmentResponseDto[]>([]);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => Promise.resolve());

  useEffect(() => {
    dispatch(fetchClientReviews());
    fetchPastAppointments();
  }, [dispatch]);

  const fetchPastAppointments = async () => {
    try {
      const response = await clientApi.getClientPastAppointmentsWithoutReview();
      setPastAppointments(response.data);
    } catch (error) {
      console.error('Error fetching past appointments:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке прошедших записей', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode: 'create' | 'edit', review?: ReviewResponseDto) => {
    setDialogMode(mode);
    if (mode === 'edit' && review) {
      setCurrentReview(review);
      setReviewForm({
        specialistId: 0, 
        clientId: 0, 
        appointmentId: 0,
        rating: review.rating,
        comment: review.comment
      });
    } else {
      setCurrentReview(null);
      setReviewForm({
        specialistId: 0,
        clientId: 0,
        appointmentId: 0,
        rating: 0,
        comment: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentReview(null);
    setReviewForm({
      specialistId: 0,
      clientId: 0,
      appointmentId: 0,
      rating: 0,
      comment: ''
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const { name, value } = event.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (event: React.SyntheticEvent<Element, Event>, value: number | null) => {
    setReviewForm(prev => ({ ...prev, rating: value || 0 }));
  };

  const handleSubmitReview = async () => {
    setConfirmAction(() => async () => {
      try {
        if (dialogMode === 'create') {
          await clientApi.createReview(reviewForm);
          setSnackbar({ open: true, message: 'Отзыв успешно создан', severity: 'success' });
        } else {
          if (currentReview) {
            const updateDto: ReviewUpdateDto = {
              rating: reviewForm.rating,
              comment: reviewForm.comment
            };
            await clientApi.updateReview(currentReview.id, updateDto);
            setSnackbar({ open: true, message: 'Отзыв успешно обновлен', severity: 'success' });
          }
        }
        handleCloseDialog();
        dispatch(fetchClientReviews());
        fetchPastAppointments();
      } catch (error) {
        console.error('Error submitting review:', error);
        setSnackbar({ open: true, message: 'Ошибка при отправке отзыва', severity: 'error' });
      }
    });
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteReview = (reviewId: number) => {
    setConfirmAction(() => async () => {
      try {
        await clientApi.deleteReview(reviewId);
        setSnackbar({ open: true, message: 'Отзыв успешно удален', severity: 'success' });
        dispatch(fetchClientReviews());
      } catch (error) {
        console.error('Error deleting review:', error);
        setSnackbar({ open: true, message: 'Ошибка при удалении отзыва', severity: 'error' });
      }
    });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    await confirmAction();
    setIsConfirmDialogOpen(false);
  };

  if (status === 'loading') {
    return <Typography>Загрузка отзывов...</Typography>;
  }

  if (status === 'failed') {
    return <Typography>Ошибка: {error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Мои отзывы</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog('create')} disabled={pastAppointments.length === 0}>
        Создать новый отзыв
      </Button>

      <List>
        {reviews.map((review) => (
          <ListItem key={review.id}>
            <ListItemText
              primary={`Специалист: ${review.specialistName}`}
              secondary={
                <>
                  <Rating value={review.rating} readOnly />
                  <Typography variant="body2">{review.comment}</Typography>
                </>
              }
            />
            <Button onClick={() => handleOpenDialog('edit', review)}>Редактировать</Button>
            <Button onClick={() => handleDeleteReview(review.id)}>Удалить</Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{dialogMode === 'create' ? 'Создать отзыв' : 'Редактировать отзыв'}</DialogTitle>
        <DialogContent>
          {dialogMode === 'create' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Выберите запись</InputLabel>
              <Select
                value={reviewForm.appointmentId}
                onChange={handleSelectChange}
                name="appointmentId"
              >
                {pastAppointments.map((appointment) => (
                  <MenuItem key={appointment.id} value={appointment.id}>
                    {`${appointment.specialistName} - ${new Date(appointment.startTime).toLocaleString()}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Rating
            name="rating"
            value={reviewForm.rating}
            onChange={handleRatingChange}
          />
          <TextField
            label="Комментарий"
            name="comment"
            value={reviewForm.comment}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmitReview} color="primary">
            {dialogMode === 'create' ? 'Создать' : 'Обновить'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onClose={() => setIsConfirmDialogOpen(false)}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите выполнить это действие?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleConfirm} color="primary">Подтвердить</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientReviews;  