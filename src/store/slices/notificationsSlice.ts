import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationResponseDto, NotificationRequestDto } from '../../types/notification';
import api from '../../api/axios';
import { RootState } from '../rootReducer';

interface NotificationsState {
  clientNotifications: any;
  notifications: NotificationResponseDto[];
  currentNotification: NotificationResponseDto | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  currentNotification: null,
  status: 'idle',
  error: null,
  clientNotifications: undefined
};

export const fetchNotifications = createAsyncThunk<NotificationResponseDto[], void, { rejectValue: string }>(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/notifications');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch notifications');
    }
  }
);

export const createNotification = createAsyncThunk<NotificationResponseDto, NotificationRequestDto, { rejectValue: string }>(
  'notifications/create',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/notifications', notificationData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create notification');
    }
  }
);

export const deleteNotification = createAsyncThunk<number, number, { rejectValue: string }>(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete notification');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetNotificationsStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.notifications.push(action.payload);
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
        if (state.currentNotification?.id === action.payload) {
          state.currentNotification = null;
        }
      });
  },
});

export const { resetNotificationsStatus } = notificationsSlice.actions;

export const selectAllNotifications = (state: RootState) => state.notifications.notifications;
export const selectNotificationById = (state: RootState, notificationId: number) => 
  state.notifications.notifications.find((notification: { id: number; }) => notification.id === notificationId);
export const selectCurrentNotification = (state: RootState) => state.notifications.currentNotification;
export const selectNotificationsStatus = (state: RootState) => state.notifications.status;
export const selectNotificationsError = (state: RootState) => state.notifications.error;

export default notificationsSlice.reducer;