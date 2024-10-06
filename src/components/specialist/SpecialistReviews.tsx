import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchReviews, selectReviewsStatus, selectAllReviews } from '../../store/slices/reviewsSlice';
import { ReviewResponseDto } from '../../types/review';
import { CircularProgress, Typography, List, ListItem, ListItemText, Rating, Box } from '@mui/material';

const SpecialistReviews: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector(selectAllReviews);
  const status = useSelector(selectReviewsStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReviews());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return <Typography color="error">Не удалось загрузить отзывы. Пожалуйста, попробуйте позже.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Отзывы обо мне
      </Typography>
      {reviews.length === 0 ? (
        <Typography>У вас пока нет отзывов.</Typography>
      ) : (
        <List>
          {reviews.map((review: ReviewResponseDto) => (
            <ListItem key={review.id} divider>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1">{review.clientName}</Typography>
                    <Rating value={review.rating} readOnly sx={{ ml: 2 }} />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1">{review.comment}</Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SpecialistReviews;