import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppointmentResponseDto, AppointmentCreateDto, AppointmentBookDto } from '../../types/appointment';
import api from '../../api/axios';
import { RootState } from '../rootReducer';
import { specialistApi } from '../../api/specialistApi';

interface AppointmentsState {
  clientAppointments: AppointmentResponseDto[];  
  specialistAppointments: AppointmentResponseDto[] | null;
  freeAppointments: AppointmentResponseDto[];
  appointments: AppointmentResponseDto[];
  currentAppointment: AppointmentResponseDto | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AppointmentsState = {
  appointments: [],
  currentAppointment: null,
  status: 'idle',
  error: null,
  clientAppointments: [],  
  specialistAppointments: null,
  freeAppointments: []
};

export const fetchSpecialistAppointments = createAsyncThunk<AppointmentResponseDto[], number, { rejectValue: string }>(
  'appointments/fetchSpecialist',
  async (specialistId, { rejectWithValue }) => {
    try {
      const response = await specialistApi.getSpecialistAppointments(specialistId);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch specialist appointments');
    }
  }
);

export const fetchFreeAppointments = createAsyncThunk<AppointmentResponseDto[], number, { rejectValue: string }>(
  'appointments/fetchFree',
  async (specialistId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/appointments/free?specialistId=${specialistId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Не удалось загрузить свободные записи');
    }
  }
);

export const fetchClientAppointments = createAsyncThunk<AppointmentResponseDto[], void, { rejectValue: string }>(
  'appointments/fetchClient',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/appointments/client');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch client appointments');
    }
  }
);

export const fetchAppointments = createAsyncThunk<AppointmentResponseDto[], void, { rejectValue: string }>(
  'appointments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/appointments');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch appointments');
    }
  }
);

export const createAppointment = createAsyncThunk<AppointmentResponseDto, AppointmentCreateDto, { rejectValue: string }>(
  'appointments/create',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/appointments', appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create appointment');
    }
  }
);

export const cancelBooking = createAsyncThunk<AppointmentResponseDto, number, { rejectValue: string }>(
  'appointments/cancelBooking',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/appointments/${id}/cancel-booking`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to cancel booking');
    }
  }
);

export const fetchClientPastAppointmentsWithoutReview = createAsyncThunk<AppointmentResponseDto[], void, { rejectValue: string }>(
  'appointments/fetchClientPastWithoutReview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/appointments/client/past-without-review');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch past appointments without review');
    }
  }
);

export const bookAppointment = createAsyncThunk<AppointmentResponseDto, { id: number; data: AppointmentBookDto }, { rejectValue: string }>(
  'appointments/book',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/appointments/${id}/book`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to book appointment');
    }
  }
);

export const cancelClientAppointment = createAsyncThunk<AppointmentResponseDto, number, { rejectValue: string }>(
  'appointments/cancelClient',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/appointments/${appointmentId}/cancel-client`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to cancel appointment');
    }
  }
);

export const deleteAppointment = createAsyncThunk<number, number, { rejectValue: string }>(
  'appointments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/appointments/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete appointment');
    }
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    resetAppointmentsStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      })
      .addCase(fetchClientAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClientAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clientAppointments = action.payload;
      })
      .addCase(fetchClientAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(cancelClientAppointment.fulfilled, (state, action: PayloadAction<AppointmentResponseDto>) => {
        const index = state.clientAppointments.findIndex(appointment => appointment.id === action.payload.id);
        if (index !== -1) {
          state.clientAppointments[index] = action.payload;
        }
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(appointment => appointment.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload;
        }
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(appointment => appointment.id !== action.payload);
        if (state.currentAppointment?.id === action.payload) {
          state.currentAppointment = null;
        }
      })
      .addCase(fetchSpecialistAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSpecialistAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.specialistAppointments = action.payload;
      })
      .addCase(fetchSpecialistAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(fetchFreeAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFreeAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.freeAppointments = action.payload;
      })
      .addCase(fetchFreeAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Не удалось загрузить свободные записи';
      });
  },
});

export const { resetAppointmentsStatus } = appointmentsSlice.actions;

export const selectAllAppointments = (state: RootState) => state.appointments.appointments;
export const selectAppointmentById = (state: RootState, appointmentId: number) => 
  state.appointments.appointments.find((appointment: { id: number; }) => appointment.id === appointmentId);
export const selectCurrentAppointment = (state: RootState) => state.appointments.currentAppointment;
export const selectAppointmentsStatus = (state: RootState) => state.appointments.status;
export const selectAppointmentsError = (state: RootState) => state.appointments.error;
export const selectSpecialistAppointments = (state: RootState) => state.appointments.specialistAppointments;
export const selectFreeAppointments = (state: RootState) => state.appointments.freeAppointments;

export default appointmentsSlice.reducer;