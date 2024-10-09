import axios from 'axios';
import store from '../store/store';
import { setToken } from '../store/slices/authSlice';

const API_BASE_URL = 'https://my-appointment-system-fe5cb7ef8f3f.herokuapp.com';

 export const loginApi = async (email: string, password: string) => {
    
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
  const { token } = response.data;
  store.dispatch(setToken(token));
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