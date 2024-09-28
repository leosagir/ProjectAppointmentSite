import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AdminResponseDto, AdminRequestDto, AdminUpdateDto } from '../../types/admin';
import api from '../../api/axios';
import { RootState } from '../rootReducer';

interface AdminsState {
  admins: AdminResponseDto[];
  currentAdmin: AdminResponseDto | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdminsState = {
  admins: [],
  currentAdmin: null,
  status: 'idle',
  error: null,
};

export const fetchAdmins = createAsyncThunk<AdminResponseDto[], void, { rejectValue: string }>(
  'admins/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/admin');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch admins');
    }
  }
);

export const fetchAdminById = createAsyncThunk<AdminResponseDto, number, { rejectValue: string }>(
  'admins/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/admin/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch admin');
    }
  }
);

export const createAdmin = createAsyncThunk<AdminResponseDto, AdminRequestDto, { rejectValue: string }>(
  'admins/create',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/admin/register', adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create admin');
    }
  }
);

export const updateAdmin = createAsyncThunk<AdminResponseDto, { id: number; data: AdminUpdateDto }, { rejectValue: string }>(
  'admins/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/admin/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update admin');
    }
  }
);

export const deactivateAdmin = createAsyncThunk<AdminResponseDto, number, { rejectValue: string }>(
  'admins/deactivate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/admin/${id}/deactivate`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to deactivate admin');
    }
  }
);

export const reactivateAdmin = createAsyncThunk<AdminResponseDto, number, { rejectValue: string }>(
  'admins/reactivate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/admin/${id}/reactivate`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to reactivate admin');
    }
  }
);

const adminsSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    resetAdminsStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.currentAdmin = action.payload;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.admins.push(action.payload);
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        const index = state.admins.findIndex(admin => admin.id === action.payload.id);
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
        if (state.currentAdmin?.id === action.payload.id) {
          state.currentAdmin = action.payload;
        }
      })
      .addCase(deactivateAdmin.fulfilled, (state, action) => {
        const index = state.admins.findIndex(admin => admin.id === action.payload.id);
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
        if (state.currentAdmin?.id === action.payload.id) {
          state.currentAdmin = action.payload;
        }
      })
      .addCase(reactivateAdmin.fulfilled, (state, action) => {
        const index = state.admins.findIndex(admin => admin.id === action.payload.id);
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
        if (state.currentAdmin?.id === action.payload.id) {
          state.currentAdmin = action.payload;
        }
      });
  },
});

export const { resetAdminsStatus } = adminsSlice.actions;

export const selectAllAdmins = (state: RootState) => state.admins.admins;
export const selectAdminById = (state: RootState, adminId: number) => 
  state.admins.admins.find((admin: { id: number; }) => admin.id === adminId);
export const selectCurrentAdmin = (state: RootState) => state.admins.currentAdmin;
export const selectAdminsStatus = (state: RootState) => state.admins.status;
export const selectAdminsError = (state: RootState) => state.admins.error;

export default adminsSlice.reducer;