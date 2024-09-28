import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SpecialistResponseDto, SpecialistRequestDto, SpecialistUpdateDto, SpecialistDetailedDto } from '../../types/specialists';
import { RootState } from '../rootReducer';
import axios from 'axios';
import api from '../../api/axios';

interface SpecialistsState {
    specialists: SpecialistResponseDto[];
    currentSpecialist: SpecialistResponseDto | null;
    detailedSpecialist: SpecialistDetailedDto | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SpecialistsState = {
    specialists: [],
    currentSpecialist: null,
    detailedSpecialist: null,
    status: 'idle',
    error: null
};

export const fetchSpecialists = createAsyncThunk<SpecialistResponseDto[], void, {rejectValue: string}>(
    'specialists/fetchAll',
    async(_, {rejectWithValue}) => {
        try {
            const response = await api.get('/api/specialists');
            return response.data;
        } catch(error) {
            return rejectWithValue('Failed to fetch specialists');
        }
    }
);

export const fetchSpecialistById = createAsyncThunk<SpecialistResponseDto, number, { rejectValue: string }>(
    'specialists/fetchById',
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.get(`/api/specialists/${id}`);
        return response.data;
      } catch (error) {
        return rejectWithValue('Failed to fetch specialist');
      }
    }
);

export const createSpecialist = createAsyncThunk<SpecialistResponseDto, SpecialistRequestDto, {rejectValue: string}>(
    'specialists/create',
    async (specialistData, {rejectWithValue}) => {
        try {
            const response = await api.post('/api/specialists/register', specialistData);
            return response.data;
        } catch(error) {
            return rejectWithValue('Failed to create specialist');
        }
    }
);

export const updateSpecialist = createAsyncThunk<SpecialistResponseDto, {id: number; data: SpecialistUpdateDto}, {rejectValue: string}>(
    'specialists/update',
    async({id, data}, {rejectWithValue}) => {
        try {
            const response = await api.put(`/api/specialists/${id}`, data);
            return response.data;
        } catch(error) {
            return rejectWithValue('Failed to update specialist');
        }
    }
);

export const deleteSpecialist = createAsyncThunk<number, number, {rejectValue: string}>(
    'specialists/delete',
    async (id, {rejectWithValue}) => {
        try {
            await api.delete(`/api/specialists/${id}`);
            return id;
        } catch(error) {
            return rejectWithValue('Failed to delete specialist');
        }
    }
);

export const deactivateSpecialist = createAsyncThunk<SpecialistResponseDto, number, { rejectValue: string }>(
    'specialists/deactivate',
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.post(`/api/specialists/${id}/deactivate`);
        return response.data;
      } catch (error) {
        return rejectWithValue('Failed to deactivate specialist');
      }
    }
);
  
export const reactivateSpecialist = createAsyncThunk<SpecialistResponseDto, number, { rejectValue: string }>(
    'specialists/reactivate',
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.post(`/api/specialists/${id}/reactivate`);
        return response.data;
      } catch (error) {
        return rejectWithValue('Failed to reactivate specialist');
      }
    }
);

export const fetchCurrentSpecialist = createAsyncThunk<SpecialistResponseDto, void, { rejectValue: string }>(
    'specialists/fetchCurrent',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get('/api/specialists/my');
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return rejectWithValue('Unauthorized: Please log in to access this information');
        }
        return rejectWithValue('Failed to fetch current specialist');
      }
    }
);

const specialistsSlice = createSlice({
    name: 'specialists',
    initialState,
    reducers: {
        resetSpecialistsStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpecialists.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSpecialists.fulfilled, (state, action: PayloadAction<SpecialistResponseDto[]>) => {
                state.status = 'succeeded';
                state.specialists = action.payload;
            })
            .addCase(fetchSpecialists.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Unknown error occurred';
            })
            .addCase(fetchSpecialistById.fulfilled, (state, action: PayloadAction<SpecialistResponseDto>) => {
                state.detailedSpecialist = action.payload as SpecialistDetailedDto;
            })
            .addCase(createSpecialist.fulfilled, (state, action: PayloadAction<SpecialistResponseDto>) => {
                state.specialists.push(action.payload);
            })
            .addCase(updateSpecialist.fulfilled, (state, action: PayloadAction<SpecialistResponseDto>) => {
                const index = state.specialists.findIndex(specialist => specialist.id === action.payload.id);
                if(index !== -1) {
                    state.specialists[index] = action.payload;
                }
                if(state.currentSpecialist?.id === action.payload.id) {
                    state.currentSpecialist = action.payload;
                }
            })
            .addCase(deleteSpecialist.fulfilled, (state, action: PayloadAction<number>) => {
                state.specialists = state.specialists.filter((specialist: SpecialistResponseDto) => specialist.id !== action.payload);
                if(state.currentSpecialist?.id === action.payload) {
                    state.currentSpecialist = null;
                }
            })
            .addCase(fetchCurrentSpecialist.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCurrentSpecialist.fulfilled, (state, action: PayloadAction<SpecialistResponseDto>) => {
                state.status = 'succeeded';
                state.currentSpecialist = action.payload;
            })
            .addCase(deactivateSpecialist.fulfilled, (state, action: PayloadAction<SpecialistResponseDto>) => {
                const index = state.specialists.findIndex(specialist => specialist.id === action.payload.id);
                if (index !== -1) {
                  state.specialists[index] = action.payload;
                }
                if (state.currentSpecialist?.id === action.payload.id) {
                  state.currentSpecialist = action.payload;
                }
            })
            .addCase(reactivateSpecialist.fulfilled, (state, action: PayloadAction<SpecialistResponseDto>) => {
                const index = state.specialists.findIndex(specialist => specialist.id === action.payload.id);
                if (index !== -1) {
                  state.specialists[index] = action.payload;
                }
                if (state.currentSpecialist?.id === action.payload.id) {
                  state.currentSpecialist = action.payload;
                }
            })
            .addCase(fetchCurrentSpecialist.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Unknown error occurred';
                state.currentSpecialist = null;
            });        
    },
});

export const { resetSpecialistsStatus } = specialistsSlice.actions;

export const selectAllSpecialists = (state: RootState) => state.specialists.specialists;
export const selectSpecialistById = (state: RootState, specialistId: number) => 
    state.specialists.specialists.find((specialist: SpecialistResponseDto) => specialist.id === specialistId);
export const selectCurrentSpecialist = (state: RootState) => state.specialists.currentSpecialist;
export const selectSpecialistsStatus = (state: RootState) => state.specialists.status;
export const selectSpecialistsError = (state: RootState) => state.specialists.error;

export default specialistsSlice.reducer;