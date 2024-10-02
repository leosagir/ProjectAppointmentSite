import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppointmentResponseDto, AppointmentCreateDto, AppointmentUpdateDto, AppointmentBookDto } from '../../types/appointment';
import api from '../../api/axios';
import { RootState } from '../rootReducer';
import { specialistApi } from '../../api/specialistApi';

interface AppointmentsState {
  clientAppointments: any;
  specialistAppointments: any;
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
  clientAppointments: undefined,
  specialistAppointments: undefined
};

export const fetchSpecialistAppointments = createAsyncThunk<AppointmentResponseDto[], number, { rejectValue: string }>(
  'appointments/fetchSpecialist',
  async (specialistId, { rejectWithValue }) => {
    try {
      const response = await specialistApi.getSpecialistAppointments(specialistId);
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching specialist appointments:', error);
      return rejectWithValue('Failed to fetch specialist appointments');
    }
  }
);

export const fetchAppointments = createAsyncThunk<AppointmentResponseDto[], void, { rejectValue: string }>(
  'appointments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/appointments');
      console.log('Appointments received from server:', response.data);
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

export const updateAppointment = createAsyncThunk<AppointmentResponseDto, { id: number; data: AppointmentUpdateDto }, { rejectValue: string }>(
  'appointments/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/appointments/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update appointment');
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
        console.log('Updating appointments in Redux store:', action.payload);
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
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(appointment => appointment.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload;
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
        console.log('Specialist appointments updated in Redux:', action.payload);
      })
      .addCase(fetchSpecialistAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
        console.error('Failed to fetch specialist appointments:', action.payload);
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

export default appointmentsSlice.reducer;