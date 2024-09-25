import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const loginApi = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
  return response.data;
};

export const registerApi = async (userData: any) => {
  const response = await axios.post(`${API_BASE_URL}/api/public/client/register`, userData);
  return response.data;
};

export const refreshTokenApi = async (refreshToken: string) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });
  return response.data;
};