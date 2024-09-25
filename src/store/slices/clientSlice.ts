import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ClientResponseDto, ClientRequestDto, ClientUpdateDto } from '../../types/client';
import { adminApi } from '../../api/adminApi';
import { RootState } from '../rootReducer';

interface ClientsState {
  clients: ClientResponseDto[];
  currentClient: ClientResponseDto | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ClientsState = {
  clients: [],
  currentClient: null,
  status: 'idle',
  error: null,
};

export const fetchClients = createAsyncThunk<ClientResponseDto[], void, { rejectValue: string }>(
  'clients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getAllClients();
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch clients');
    }
  }
);

export const fetchClientById = createAsyncThunk<ClientResponseDto, number, { rejectValue: string }>(
  'clients/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminApi.getClientById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch client');
    }
  }
);

export const createClient = createAsyncThunk<ClientResponseDto, ClientRequestDto, { rejectValue: string }>(
  'clients/create',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await adminApi.createClient(clientData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create client');
    }
  }
);

export const updateClient = createAsyncThunk<ClientResponseDto, { id: number; data: ClientUpdateDto }, { rejectValue: string }>(
  'clients/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await adminApi.updateClient(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update client');
    }
  }
);

export const deactivateClient = createAsyncThunk<ClientResponseDto, number, { rejectValue: string }>(
  'clients/deactivate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminApi.deactivateClient(id);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to deactivate client');
    }
  }
);

export const reactivateClient = createAsyncThunk<ClientResponseDto, number, { rejectValue: string }>(
  'clients/reactivate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminApi.reactivateClient(id);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to reactivate client');
    }
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    resetClientsStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.currentClient = action.payload;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.clients.push(action.payload);
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex(client => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      })
      .addCase(deactivateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex(client => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      })
      .addCase(reactivateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex(client => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      });
  },
});

export const { resetClientsStatus } = clientsSlice.actions;

export const selectAllClients = (state: RootState) => state.clients.clients;
export const selectClientById = (state: RootState, clientId: number) => 
  state.clients.clients.find(client => client.id === clientId);
export const selectCurrentClient = (state: RootState) => state.clients.currentClient;
export const selectClientsStatus = (state: RootState) => state.clients.status;
export const selectClientsError = (state: RootState) => state.clients.error;

export default clientsSlice.reducer;