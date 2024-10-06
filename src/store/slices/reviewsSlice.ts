import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ReviewResponseDto, ReviewCreateDto, ReviewUpdateDto } from '../../types/review';
import api from '../../api/axios';
import { RootState } from '../store';

interface ReviewsState {
  specialistReviews: ReviewResponseDto[];
  clientReviews: ReviewResponseDto[];
  allReviews: ReviewResponseDto[];
  currentReview: ReviewResponseDto | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReviewsState = {
  specialistReviews: [],
  clientReviews: [],
  allReviews: [],
  currentReview: null,
  status: 'idle',
  error: null
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

export const fetchClientReviews = createAsyncThunk<ReviewResponseDto[], void, { rejectValue: string }>(
  'reviews/fetchClient',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/reviews/client');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch client reviews');
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
      .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<ReviewResponseDto[]>) => {
        state.status = 'succeeded';
        state.allReviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(createReview.fulfilled, (state, action: PayloadAction<ReviewResponseDto>) => {
        state.allReviews.push(action.payload);
      })
      .addCase(updateReview.fulfilled, (state, action: PayloadAction<ReviewResponseDto>) => {
        const index = state.allReviews.findIndex(review => review.id === action.payload.id);
        if (index !== -1) {
          state.allReviews[index] = action.payload;
        }
        if (state.currentReview?.id === action.payload.id) {
          state.currentReview = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<number>) => {
        state.allReviews = state.allReviews.filter(review => review.id !== action.payload);
        if (state.currentReview?.id === action.payload) {
          state.currentReview = null;
        }
      });
  },
});

export const { resetReviewsStatus } = reviewsSlice.actions;

export const selectAllReviews = (state: RootState) => state.reviews.allReviews;
export const selectSpecialistReviews = (state: RootState) => state.reviews.specialistReviews;
export const selectClientReviews = (state: RootState) => state.reviews.clientReviews;
export const selectReviewById = (state: RootState, reviewId: number) => 
  state.reviews.allReviews.find((review: ReviewResponseDto) => review.id === reviewId);
export const selectCurrentReview = (state: RootState) => state.reviews.currentReview;
export const selectReviewsStatus = (state: RootState) => state.reviews.status;
export const selectReviewsError = (state: RootState) => state.reviews.error;

export default reviewsSlice.reducer;