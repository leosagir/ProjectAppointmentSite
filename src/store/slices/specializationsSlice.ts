import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SpecializationResponseDto, SpecializationRequestDto, SpecializationUpdateDto } from '../../types/specialization';
import { RootState } from '../rootReducer';
import api from '../../api/axios';

interface SpecializationsState {
  specializations: SpecializationResponseDto[];
  currentSpecialization: SpecializationResponseDto | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SpecializationsState = {
  specializations: [],
  currentSpecialization: null,
  status: 'idle',
  error: null,
};

export const fetchSpecializations = createAsyncThunk<SpecializationResponseDto[], void, { rejectValue: string }>(
  'specializations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/specializations');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch specializations');
    }
  }
);

export const fetchSpecializationById = createAsyncThunk<SpecializationResponseDto, number, { rejectValue: string }>(
  'specializations/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/specializations/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch specialization');
    }
  }
);

export const createSpecialization = createAsyncThunk<SpecializationResponseDto, SpecializationRequestDto, { rejectValue: string }>(
  'specializations/create',
  async (specializationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/specializations', specializationData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create specialization');
    }
  }
);

export const updateSpecialization = createAsyncThunk<SpecializationResponseDto, { id: number; data: SpecializationUpdateDto }, { rejectValue: string }>(
  'specializations/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/specializations/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update specialization');
    }
  }
);

export const deleteSpecialization = createAsyncThunk<number, number, { rejectValue: string }>(
  'specializations/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/specializations/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete specialization');
    }
  }
);

const specializationsSlice = createSlice({
  name: 'specializations',
  initialState,
  reducers: {
    resetSpecializationsStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecializations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSpecializations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.specializations = action.payload;
      })
      .addCase(fetchSpecializations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(fetchSpecializationById.fulfilled, (state, action) => {
        state.currentSpecialization = action.payload;
      })
      .addCase(createSpecialization.fulfilled, (state, action) => {
        state.specializations.push(action.payload);
      })
      .addCase(updateSpecialization.fulfilled, (state, action) => {
        const index = state.specializations.findIndex(specialization => specialization.id === action.payload.id);
        if (index !== -1) {
          state.specializations[index] = action.payload;
        }
        if (state.currentSpecialization?.id === action.payload.id) {
          state.currentSpecialization = action.payload;
        }
      })
      .addCase(deleteSpecialization.fulfilled, (state, action) => {
        state.specializations = state.specializations.filter(specialization => specialization.id !== action.payload);
        if (state.currentSpecialization?.id === action.payload) {
          state.currentSpecialization = null;
        }
      });
  },
});

export const { resetSpecializationsStatus } = specializationsSlice.actions;

export const selectAllSpecializations = (state: RootState) => state.specializations.specializations;
export const selectSpecializationById = (state: RootState, specializationId: number) => 
  state.specializations.specializations.find((specialization: { id: number; }) => specialization.id === specializationId);
export const selectCurrentSpecialization = (state: RootState) => state.specializations.currentSpecialization;
export const selectSpecializationsStatus = (state: RootState) => state.specializations.status;
export const selectSpecializationsError = (state: RootState) => state.specializations.error;

export default specializationsSlice.reducer;