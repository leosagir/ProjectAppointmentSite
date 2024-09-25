import axios, { AxiosResponse } from "axios";
import { AppointmentBookDto, AppointmentResponseDto } from "../types/appointment";
import { ClientResponseDto, ClientUpdateDto } from "../types/client";
import { ReviewCreateDto, ReviewResponseDto, ReviewUpdateDto } from "../types/review";
import { NotificationResponseDto } from "../types/notification";

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const clientApi = {
    getCurrentClient: (): Promise<AxiosResponse<ClientResponseDto>> => 
      api.get('/clients/my'),
    getClientById: (id: number): Promise<AxiosResponse<ClientResponseDto>> => 
      api.get(`/clients/${id}`),
    updateClient: (id: number, data: ClientUpdateDto): Promise<AxiosResponse<ClientResponseDto>> => 
      api.patch(`/clients/${id}`, data),
    getClientAppointments: (): Promise<AxiosResponse<AppointmentResponseDto[]>> => 
      api.get('/appointments/booked'),
    createReview: (data: ReviewCreateDto): Promise<AxiosResponse<ReviewResponseDto>> => 
        api.post('/reviews', data),
      updateReview: (id: number, data: ReviewUpdateDto): Promise<AxiosResponse<ReviewResponseDto>> => 
        api.put(`/reviews/${id}`, data),
    deleteReview: (id: number): Promise<AxiosResponse<void>> => 
      api.delete(`/reviews/${id}`),
    getClientNotifications: (): Promise<AxiosResponse<NotificationResponseDto[]>> => 
      api.get('/notifications/client'),
    bookAppointment: (id: number, data: AppointmentBookDto): Promise<AxiosResponse<AppointmentResponseDto>> => 
        api.put(`/appointments/${id}/book`, data),
  };
  