import axios, { AxiosResponse } from "axios";
import { SpecialistResponseDto, SpecialistUpdateDto } from "../types/specialists";
import { AppointmentResponseDto } from "../types/appointment";

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const specialistApi = {
    getCurrentSpecialist: (): Promise<AxiosResponse<SpecialistResponseDto>> => 
      api.get('/specialists/my'),
    getSpecialistById: (id: number): Promise<AxiosResponse<SpecialistResponseDto>> => 
      api.get(`/specialists/${id}`),
    updateSpecialist: (id: number, data: SpecialistUpdateDto): Promise<AxiosResponse<SpecialistResponseDto>> => 
      api.put(`/specialists/${id}`, data),
    getSpecialistAppointments: (): Promise<AxiosResponse<AppointmentResponseDto[]>> => 
      api.get('/appointments/booked'),
    getFreeAppointments: (specialistId: number): Promise<AxiosResponse<AppointmentResponseDto[]>> => 
      api.get(`/appointments/free?specialistId=${specialistId}`),
  };