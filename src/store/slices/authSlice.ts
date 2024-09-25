import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/auth';
import { ClientRequestDto } from '../../types/client';
import { removeTokens, saveTokens } from '../../utils/auth';
import api from '../../api/axios';
import axios from 'axios';

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isLoginModalOpen: false,
    isRegistrationModalOpen: false,
};
export const login = createAsyncThunk<
  { user: User; accessToken: string; refreshToken: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  console.log('Login thunk started');
  try {
    
    const response = await api.post('/api/auth/login', { email, password });
    
    saveTokens(response.data.accessToken, response.data.refreshToken);
    return {
      user: { email: response.data.email, role: response.data.roles[0] },
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  } catch (err) {
    console.error('Login error:', err);
    if (axios.isAxiosError(err)) {
      
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const refreshToken = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  void,
  { rejectValue: string; state: { auth: AuthState } }
>('auth/refreshToken', async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  try {
    const response = await api.post('/api/auth/refresh', { refreshToken: auth.refreshToken });
    saveTokens(response.data.accessToken, response.data.refreshToken);
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return rejectWithValue(err.response.data.message || 'Token refresh failed');
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const register = createAsyncThunk<
  { user: User; accessToken: string; refreshToken: string },
  ClientRequestDto,
  { rejectValue: string }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>('/api/public/client/register', userData);
    
    saveTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  } catch (err) {
    console.error('Register error:', err);
    if (axios.isAxiosError(err)) {
      if (err.response) {
        return rejectWithValue(err.response.data.message || 'Registration failed');
      } else if (err.request) {
        return rejectWithValue('Network error. Please try again.');
      }
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  removeTokens();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false; 
    },
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
    openRegistrationModal: (state) => {
      state.isRegistrationModalOpen = true;
    },
    closeRegistrationModal: (state) => {
      state.isRegistrationModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('Login fulfilled:', action.payload);
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isRegistrationModalOpen = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false; 
      });
  },
});

export const { setUser, clearAuth, openLoginModal, closeLoginModal, openRegistrationModal, closeRegistrationModal } = authSlice.actions;

export default authSlice.reducer;