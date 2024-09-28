import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewResponseDto, ReviewCreateDto, ReviewUpdateDto } from '../../types/review';
import api from '../../api/axios';
import { RootState } from '../store';

interface ReviewsState {
  specialistReviews: any;
  clientReviews: any;
  reviews: ReviewResponseDto[];
  currentReview: ReviewResponseDto | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  currentReview: null,
  status: 'idle',
  error: null,
  specialistReviews: undefined,
  clientReviews: undefined
};

export const fetchReviews = createAsyncThunk<ReviewResponseDto[], void, { rejectValue: string }>(
  'reviews/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/reviews');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk<ReviewResponseDto, ReviewCreateDto, { rejectValue: string }>(
  'reviews/create',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/reviews', reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create review');
    }
  }
);

export const updateReview = createAsyncThunk<ReviewResponseDto, { id: number; data: ReviewUpdateDto }, { rejectValue: string }>(
  'reviews/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/reviews/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk<number, number, { rejectValue: string }>(
  'reviews/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/reviews/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete review');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    resetReviewsStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(review => review.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        if (state.currentReview?.id === action.payload.id) {
          state.currentReview = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(review => review.id !== action.payload);
        if (state.currentReview?.id === action.payload) {
          state.currentReview = null;
        }
      });
  },
});

export const { resetReviewsStatus } = reviewsSlice.actions;

export const selectAllReviews = (state: RootState) => state.reviews.reviews;
export const selectReviewById = (state: RootState, reviewId: number) => 
  state.reviews.reviews.find((review: { id: number; }) => review.id === reviewId);
export const selectCurrentReview = (state: RootState) => state.reviews.currentReview;
export const selectReviewsStatus = (state: RootState) => state.reviews.status;
export const selectReviewsError = (state: RootState) => state.reviews.error;

export default reviewsSlice.reducer;