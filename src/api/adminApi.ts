import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AdminResponseDto, AdminRequestDto, AdminUpdateDto } from '../types/admin';
import { ClientResponseDto, ClientRequestDto, ClientUpdateDto } from '../types/client';
import { SpecialistResponseDto, SpecialistRequestDto, SpecialistUpdateDto } from '../types/specialists';
import { ServiceResponseDto, ServiceRequestDto, ServiceUpdateDto } from '../types/services';
import { SpecializationResponseDto, SpecializationRequestDto, SpecializationUpdateDto } from '../types/specialization';
import { AppointmentResponseDto, AppointmentCreateDto, AppointmentUpdateDto, AppointmentBookDto } from '../types/appointment';
import { ReviewResponseDto } from '../types/review';
import { NotificationResponseDto, NotificationRequestDto } from '../types/notification';
import { tokenManager } from '../utils/tokenManager';
import { refreshTokenThunk } from '../store/slices/authSlice';
import store from '../store/store';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { accessToken, refreshToken } = await store.dispatch(refreshTokenThunk()).unwrap();
        tokenManager.saveTokens(accessToken, refreshToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenManager.removeTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  // Админы
  getCurrentAdmin: (): Promise<AxiosResponse<AdminResponseDto>> => 
    api.get('/admin/my'),
  registerAdmin: (data: AdminRequestDto): Promise<AxiosResponse<AdminResponseDto>> => 
    api.post('/admin/register', data),
  getAdminById: (id: number): Promise<AxiosResponse<AdminResponseDto>> => 
    api.get(`/admin/${id}`),
  getAllAdmins: (): Promise<AxiosResponse<AdminResponseDto[]>> => 
    api.get('/admin'),
  updateAdmin: (id: number, data: AdminUpdateDto): Promise<AxiosResponse<AdminResponseDto>> => 
    api.put(`/admin/${id}`, data),
  deactivateAdmin: (id: number): Promise<AxiosResponse<AdminResponseDto>> => 
    api.post(`/admin/${id}/deactivate`),
  reactivateAdmin: (id: number): Promise<AxiosResponse<AdminResponseDto>> => 
    api.post(`/admin/${id}/reactivate`),

  // Клиенты
  getAllClients: (): Promise<AxiosResponse<ClientResponseDto[]>> => 
    api.get('/admin/clients'),
  getClientById: (id: number): Promise<AxiosResponse<ClientResponseDto>> => 
    api.get(`/admin/clients/${id}`),
  createClient: (data: ClientRequestDto): Promise<AxiosResponse<ClientResponseDto>> => 
    api.post('/admin/clients', data),
  updateClient: (id: number, data: ClientUpdateDto): Promise<AxiosResponse<ClientResponseDto>> => 
    api.put(`/admin/clients/${id}`, data),
  deactivateClient: (id: number): Promise<AxiosResponse<ClientResponseDto>> => 
    api.post(`/admin/clients/${id}/deactivate`),
  reactivateClient: (id: number): Promise<AxiosResponse<ClientResponseDto>> => 
    api.post(`/admin/clients/${id}/reactivate`),

  // Специалисты
  getAllSpecialists: (): Promise<AxiosResponse<SpecialistResponseDto[]>> => 
    api.get('/specialists'),
  getSpecialistById: (id: number): Promise<AxiosResponse<SpecialistResponseDto>> => 
    api.get(`/specialists/${id}`),
  registerSpecialist: (data: SpecialistRequestDto): Promise<AxiosResponse<SpecialistResponseDto>> => 
    api.post('/specialists/register', data),
  updateSpecialist: (id: number, data: SpecialistUpdateDto): Promise<AxiosResponse<SpecialistResponseDto>> => 
    api.put(`/specialists/${id}`, data),
  deleteSpecialist: (id: number): Promise<AxiosResponse<void>> => 
    api.delete(`/specialists/${id}`),
  deactivateSpecialist: (id: number): Promise<AxiosResponse<SpecialistResponseDto>> => 
    api.post(`/specialists/${id}/deactivate`),
  reactivateSpecialist: (id: number): Promise<AxiosResponse<SpecialistResponseDto>> => 
    api.post(`/specialists/${id}/reactivate`),

  // Услуги
  createService: (data: ServiceRequestDto): Promise<AxiosResponse<ServiceResponseDto>> => 
    api.post('/services', data),
  getServiceById: (id: number): Promise<AxiosResponse<ServiceResponseDto>> => 
    api.get(`/services/${id}`),
  getAllServices: (): Promise<AxiosResponse<ServiceResponseDto[]>> => 
    api.get('/services'),
  updateService: (id: number, data: ServiceUpdateDto): Promise<AxiosResponse<ServiceResponseDto>> => 
    api.put(`/services/${id}`, data),
  deleteService: (id: number): Promise<AxiosResponse<void>> => 
    api.delete(`/services/${id}`),

  // Специализации
  createSpecialization: (data: SpecializationRequestDto): Promise<AxiosResponse<SpecializationResponseDto>> => 
    api.post('/specializations', data),
  getSpecializationById: (id: number): Promise<AxiosResponse<SpecializationResponseDto>> => 
    api.get(`/specializations/${id}`),
  getAllSpecializations: (): Promise<AxiosResponse<SpecializationResponseDto[]>> => 
    api.get('/specializations'),
  updateSpecialization: (id: number, data: SpecializationUpdateDto): Promise<AxiosResponse<SpecializationResponseDto>> => 
    api.put(`/specializations/${id}`, data),
  deleteSpecialization: (id: number): Promise<AxiosResponse<void>> => 
    api.delete(`/specializations/${id}`),

  // Записи
  createAppointment: (data: AppointmentCreateDto): Promise<AxiosResponse<AppointmentResponseDto>> => 
    api.post('/appointments', data),
  getAllAppointments: (): Promise<AxiosResponse<AppointmentResponseDto[]>> => 
    api.get('/appointments'),
  getAppointmentById: (id: number): Promise<AxiosResponse<AppointmentResponseDto>> => 
    api.get(`/appointments/${id}`),
  updateAppointment: (id: number, data: AppointmentUpdateDto): Promise<AxiosResponse<AppointmentResponseDto>> => 
    api.put(`/appointments/${id}`, data),
  deleteAppointment: (id: number): Promise<AxiosResponse<void>> => 
    api.delete(`/appointments/${id}`),
    bookAppointment: (id: number, data: AppointmentBookDto): Promise<AxiosResponse<AppointmentResponseDto>> => 
      api.put(`/appointments/${id}/book`, data),
  

  // Отзывы
  getAllReviews: (): Promise<AxiosResponse<ReviewResponseDto[]>> => 
    api.get('/reviews'),
  getReviewById: (id: number): Promise<AxiosResponse<ReviewResponseDto>> => 
    api.get(`/reviews/${id}`),
  deleteReview: (id: number): Promise<AxiosResponse<void>> => 
    api.delete(`/reviews/${id}`),

  // Уведомления
  createNotification: (data: NotificationRequestDto): Promise<AxiosResponse<NotificationResponseDto>> => 
    api.post('/notifications', data),
  getAllNotifications: (): Promise<AxiosResponse<NotificationResponseDto[]>> => 
    api.get('/notifications'),
  getNotificationById: (id: number): Promise<AxiosResponse<NotificationResponseDto>> => 
    api.get(`/notifications/${id}`),
  deleteNotification: (id: number): Promise<AxiosResponse<void>> => 
    api.delete(`/notifications/${id}`),
};