import axios, { AxiosResponse } from "axios";
import { AppointmentBookDto, AppointmentResponseDto } from "../types/appointment";
import { ClientResponseDto, ClientUpdateDto } from "../types/client";
import { ReviewCreateDto, ReviewResponseDto, ReviewUpdateDto } from "../types/review";
import { NotificationResponseDto } from "../types/notification";
import { tokenManager } from '../utils/tokenManager';

const api = axios.create({
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

export const clientApi = {
    getCurrentClient: (): Promise<AxiosResponse<ClientResponseDto>> => 
      api.get('/api/clients/my'),
    getClientById: (id: number): Promise<AxiosResponse<ClientResponseDto>> => 
      api.get(`/api/clients/${id}`),
    updateClient: (id: number, data: ClientUpdateDto): Promise<AxiosResponse<ClientResponseDto>> => 
      api.patch(`/api/clients/${id}`, data),
    getClientAppointments: (): Promise<AxiosResponse<AppointmentResponseDto[]>> => 
      api.get('/api/appointments/booked'),
    createReview: (data: ReviewCreateDto): Promise<AxiosResponse<ReviewResponseDto>> => 
        api.post('/api/reviews', data),
    updateReview: (id: number, data: ReviewUpdateDto): Promise<AxiosResponse<ReviewResponseDto>> => 
        api.put(`/api/reviews/${id}`, data),
    deleteReview: (id: number): Promise<AxiosResponse<void>> => 
      api.delete(`/api/reviews/${id}`),
    getClientPastAppointmentsWithoutReview: (): Promise<AxiosResponse<AppointmentResponseDto[]>> => 
      api.get('/api/appointments/client/past-without-review'),
    getClientNotifications: (clientId: number): Promise<AxiosResponse<NotificationResponseDto[]>> => 
      api.get(`/api/notifications/client/${clientId}`),
    bookAppointment: (id: number, data: AppointmentBookDto): Promise<AxiosResponse<AppointmentResponseDto>> => 
        api.put(`/api/appointments/${id}/book`, data),
  };



