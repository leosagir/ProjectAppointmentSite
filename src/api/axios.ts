import axios, { AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, isTokenExpired, saveTokens, removeTokens } from '../utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  
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

const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return null;
    }
  
    try {
      const { data } = await api.post('/api/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = data;
      saveTokens(accessToken, newRefreshToken);
      return accessToken;
    } catch (error) {
      removeTokens();
      return null;
    }
  };

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let accessToken = getAccessToken();
    
    if (!accessToken || isTokenExpired(accessToken)) {
      if (!isRefreshing) {
        isRefreshing = true;
        accessToken = await refreshAccessToken();
        isRefreshing = false;

        if (accessToken) {
          processQueue(null, accessToken);
        } else {
          processQueue(new AxiosError('Failed to refresh token'));
          removeTokens();
          window.location.href = '/login';
          return Promise.reject('Authentication required');
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          config.headers['Authorization'] = `Bearer ${token}`;
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
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          } else {
            originalRequest.headers = { 'Authorization': `Bearer ${token}` };
          }
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const accessToken = await refreshAccessToken();
        isRefreshing = false;

        if (accessToken) {
          processQueue(null, accessToken);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          } else {
            originalRequest.headers = { 'Authorization': `Bearer ${accessToken}` };
          }
          return api(originalRequest);
        } else {
          processQueue(new AxiosError('Failed to refresh token'));
          removeTokens();
          window.location.href = '/login';
          return Promise.reject('Authentication required');
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        removeTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;