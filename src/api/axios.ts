import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenManager } from '../utils/tokenManager';

// Создаем пользовательский интерфейс, расширяющий InternalAxiosRequestConfig
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
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (error.response?.status === 403) console.error('Доступ запрещен');
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = tokenManager.getRefreshToken();
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        tokenManager.saveTokens(accessToken, newRefreshToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenManager.removeTokens();
        // Здесь можно добавить логику для перенаправления на страницу входа
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
