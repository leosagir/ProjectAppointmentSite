import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { clientApi } from '../../api/clientApi';
import { ReviewResponseDto, ReviewCreateDto, ReviewUpdateDto } from '../../types/review';
import { fetchReviews, selectAllReviews, selectReviewsStatus, selectReviewsError } from '../../store/slices/reviewsSlice';
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
  Alert
} from '@mui/material';

const ClientReviews: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector(selectAllReviews);
  const status = useSelector(selectReviewsStatus);
  const error = useSelector(selectReviewsError);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [currentReview, setCurrentReview] = useState<ReviewResponseDto | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewCreateDto | ReviewUpdateDto>({
    rating: 0,
    comment: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReviews());
    }
  }, [status, dispatch]);

  const handleOpenDialog = (mode: 'create' | 'edit', review?: ReviewResponseDto) => {
    setDialogMode(mode);
    if (mode === 'edit' && review) {
      setCurrentReview(review);
      setReviewForm({
        rating: review.rating,
        comment: review.comment
      });
    } else {
      setCurrentReview(null);
      setReviewForm({
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
      rating: 0,
      comment: ''
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setReviewForm({ ...reviewForm, [name]: value });
  };

  const handleRatingChange = (event: React.SyntheticEvent<Element, Event>, value: number | null) => {
    setReviewForm({ ...reviewForm, rating: value || 0 });
  };

  const handleSubmitReview = async () => {
    try {
      if (dialogMode === 'create') {
        await clientApi.createReview(reviewForm as ReviewCreateDto);
        setSnackbar({ open: true, message: 'Отзыв успешно создан', severity: 'success' });
      } else {
        if (currentReview) {
          await clientApi.updateReview(currentReview.id, reviewForm as ReviewUpdateDto);
          setSnackbar({ open: true, message: 'Отзыв успешно обновлен', severity: 'success' });
        }
      }
      handleCloseDialog();
      dispatch(fetchReviews());
    } catch (error) {
      console.error('Error submitting review:', error);
      setSnackbar({ open: true, message: 'Ошибка при отправке отзыва', severity: 'error' });
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await clientApi.deleteReview(reviewId);
      setSnackbar({ open: true, message: 'Отзыв успешно удален', severity: 'success' });
      dispatch(fetchReviews());
    } catch (error) {
      console.error('Error deleting review:', error);
      setSnackbar({ open: true, message: 'Ошибка при удалении отзыва', severity: 'error' });
    }
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
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog('create')}>
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