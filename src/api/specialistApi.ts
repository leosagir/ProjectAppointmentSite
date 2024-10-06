import axios, { AxiosResponse } from "axios";
import { SpecialistResponseDto, SpecialistUpdateDto } from "../types/specialists";
import { AppointmentResponseDto } from "../types/appointment";
import { tokenManager } from '../utils/tokenManager';

const api = axios.create({
  baseURL: 'http://localhost:8080', 
    headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const specialistApi = {
  getCurrentSpecialist: (): Promise<AxiosResponse<SpecialistResponseDto>> => {
    console.log('Отправка запроса для получения текущего специалиста');
    return api.get('/api/specialists/me');
  },
    getSpecialistById: (id: number): Promise<AxiosResponse<SpecialistResponseDto>> => 
      api.get(`/specialists/${id}`),
    updateSpecialist: (id: number, data: SpecialistUpdateDto): Promise<AxiosResponse<SpecialistResponseDto>> => 
      api.put(`/specialists/${id}`, data),
    getSpecialistAppointments: (specialistId: number): Promise<AxiosResponse<AppointmentResponseDto[]>> => {
      console.log('Sending request to:', `/api/appointments/specialist/${specialistId}`);
      return api.get(`/api/appointments/specialist/${specialistId}`);
    },
    getFreeAppointments: (specialistId: number): Promise<AxiosResponse<AppointmentResponseDto[]>> => 
      api.get(`/appointments/free?specialistId=${specialistId}`),
  };