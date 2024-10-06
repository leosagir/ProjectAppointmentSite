import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchReviews, selectAllReviews, selectReviewsStatus, selectReviewsError } from '../../store/slices/reviewsSlice';
import { ReviewResponseDto } from '../../types/review';
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Rating,
  SelectChangeEvent,
} from '@mui/material';

type SortOption = 'rating' | 'specialist' | 'date';

const ReviewManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector(selectAllReviews);
  const status = useSelector(selectReviewsStatus);
  const error = useSelector(selectReviewsError);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [selectedReview, setSelectedReview] = useState<ReviewResponseDto | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReviews());
    }
  }, [status, dispatch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    setSortBy(event.target.value as SortOption);
  };

  const handleReviewClick = (review: ReviewResponseDto) => {
    setSelectedReview(review);
  };

  const filteredAndSortedReviews = reviews
    .filter((review: ReviewResponseDto) =>
      review.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.specialistName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: ReviewResponseDto, b: ReviewResponseDto) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'specialist':
          return a.specialistName.localeCompare(b.specialistName);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Управление отзывами
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Поиск по имени клиента или специалиста"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Сортировать по</InputLabel>
            <Select<SortOption>
              value={sortBy}
              onChange={handleSortChange}
              label="Сортировать по"
            >
              <MenuItem value="rating">Рейтингу</MenuItem>
              <MenuItem value="specialist">Специалисту</MenuItem>
              <MenuItem value="date">Дате</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <List>
        {filteredAndSortedReviews.map((review: ReviewResponseDto) => (
          <Paper key={review.id} elevation={1} style={{ margin: '10px 0', padding: '10px' }}>
            <ListItemButton onClick={() => handleReviewClick(review)}>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">
                      {review.clientName} о {review.specialistName}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">
                      Дата: {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">{review.comment}</Typography>
                  </>
                }
              />
            </ListItemButton>
          </Paper>
        ))}
      </List>
      {selectedReview && (
        <Box mt={2}>
          <Typography variant="h6">Выбранный отзыв:</Typography>
          <Paper elevation={3} style={{ padding: '15px', marginTop: '10px' }}>
            <Typography variant="subtitle1">
              {selectedReview.clientName} о {selectedReview.specialistName}
            </Typography>
            <Rating value={selectedReview.rating} readOnly />
            <Typography variant="body2" color="textSecondary">
              Дата: {new Date(selectedReview.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" style={{ marginTop: '10px' }}>
              {selectedReview.comment}
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ReviewManagement;