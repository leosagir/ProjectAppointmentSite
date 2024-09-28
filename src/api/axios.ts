import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenManager } from '../utils/tokenManager';

// Создаем пользовательский интерфейс, расширяющий InternalAxiosRequestConfig
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: 'http://localhost:3000', // Измените на ваш базовый URL
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


/*import axios, { AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { tokenManager } from '../utils/tokenManager';
import store from '../store/store';
import { refreshTokenThunk } from '../store/slices/authSlice';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let accessToken = tokenManager.getAccessToken();
    
    if (!accessToken || tokenManager.isTokenExpired(accessToken)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await store.dispatch(refreshTokenThunk()).unwrap();
          tokenManager.saveTokens(newAccessToken, newRefreshToken);
          accessToken = newAccessToken;
        } catch (error) {
          processQueue(error as AxiosError);
          tokenManager.removeTokens();
          window.location.href = '/login';
          return Promise.reject('Authentication required');
        } finally {
          isRefreshing = false;
        }
        processQueue(null, accessToken);
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          config.headers['Authorization'] = `Bearer ${token as string}`;
          return config;
        }).catch(error => {
          return Promise.reject(error);
        });
      }
    }

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token as string}`;
          } else {
            originalRequest.headers = { 'Authorization': `Bearer ${token as string}` };
          }
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken, refreshToken } = await store.dispatch(refreshTokenThunk()).unwrap();
        tokenManager.saveTokens(accessToken, refreshToken);
        isRefreshing = false;

        processQueue(null, accessToken);
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        } else {
          originalRequest.headers = { 'Authorization': `Bearer ${accessToken}` };
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        tokenManager.removeTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;*/