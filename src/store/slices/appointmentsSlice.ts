import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppointmentResponseDto, AppointmentCreateDto, AppointmentUpdateDto, AppointmentBookDto } from '../../types/appointment';
import { adminApi } from '../../api/adminApi';
import { RootState } from '../rootReducer';

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

export const fetchAppointments = createAsyncThunk<AppointmentResponseDto[], void, { rejectValue: string }>(
  'appointments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getAllAppointments();
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
      const response = await adminApi.createAppointment(appointmentData);
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
      const response = await adminApi.updateAppointment(id, data);
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
      const response = await adminApi.bookAppointment(id, data);
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
      await adminApi.deleteAppointment(id);
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
        state.status = 'succeeded';
        state.appointments = action.payload;
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
      });
  },
});

export const { resetAppointmentsStatus } = appointmentsSlice.actions;

export const selectAllAppointments = (state: RootState) => state.appointments.appointments;
export const selectAppointmentById = (state: RootState, appointmentId: number) => 
  state.appointments.appointments.find(appointment => appointment.id === appointmentId);
export const selectCurrentAppointment = (state: RootState) => state.appointments.currentAppointment;
export const selectAppointmentsStatus = (state: RootState) => state.appointments.status;
export const selectAppointmentsError = (state: RootState) => state.appointments.error;

export default appointmentsSlice.reducer;