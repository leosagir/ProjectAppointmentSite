import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenManager } from '../utils/tokenManager';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: 'https://my-appointment-system-fe5cb7ef8f3f.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request config:', config);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response:', response);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    console.error('Response error:', error.response?.status, error.message);

    if (error.response?.status === 403) {
      console.error('Доступ запрещен');
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Attempting to refresh token');
      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        const response = await axios.post(`${api.defaults.baseURL}/api/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        tokenManager.saveTokens(accessToken, newRefreshToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        console.log('Token refreshed successfully');
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        tokenManager.removeTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;