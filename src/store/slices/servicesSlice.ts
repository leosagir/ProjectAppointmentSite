import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ServiceResponseDto, ServiceRequestDto, ServiceUpdateDto } from '../../types/services';
import api from '../../api/axios';
import { RootState } from '../store';

interface ServicesState {
  specialistServices: any;
  services: ServiceResponseDto[];
  currentService: ServiceResponseDto | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  currentService: null,
  status: 'idle',
  error: null,
  specialistServices: undefined
};

export const fetchServices = createAsyncThunk<ServiceResponseDto[], void, { rejectValue: string }>(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/services');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch services');
    }
  }
);

export const fetchServiceById = createAsyncThunk<ServiceResponseDto, number, { rejectValue: string }>(
  'services/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/services/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch service');
    }
  }
);

export const createService = createAsyncThunk<ServiceResponseDto, ServiceRequestDto, { rejectValue: string }>(
  'services/create',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/services', serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk<ServiceResponseDto, { id: number; data: ServiceUpdateDto }, { rejectValue: string }>(
  'services/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/services/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk<number, number, { rejectValue: string }>(
  'services/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/services/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete service');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    resetServicesStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.currentService = action.payload;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex(service => service.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        if (state.currentService?.id === action.payload.id) {
          state.currentService = action.payload;
        }
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(service => service.id !== action.payload);
        if (state.currentService?.id === action.payload) {
          state.currentService = null;
        }
      });
  },
});

export const { resetServicesStatus } = servicesSlice.actions;

export const selectAllServices = (state: RootState) => state.services.services;
export const selectServiceById = (state: RootState, serviceId: number) => 
  state.services.services.find((service: { id: number; }) => service.id === serviceId);
export const selectCurrentService = (state: RootState) => state.services.currentService;
export const selectServicesStatus = (state: RootState) => state.services.status;
export const selectServicesError = (state: RootState) => state.services.error;

export default servicesSlice.reducer;