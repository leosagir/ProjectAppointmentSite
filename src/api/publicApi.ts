import axios, { AxiosResponse } from "axios";
import { ClientRequestDto, ClientResponseDto } from "../types/client";
import { ServiceResponseDto } from "../types/services";
import { SpecializationResponseDto } from "../types/specialization";
import { SpecialistResponseDto } from "../types/specialists";

const api = axios.create({
  baseURL: 'https://my-appointment-system-fe5cb7ef8f3f.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicApi = {
    registerClient: (data: ClientRequestDto): Promise<AxiosResponse<ClientResponseDto>> => 
      api.post('/api/public/client/register', data),
    getAllServices: (): Promise<AxiosResponse<ServiceResponseDto[]>> => 
      api.get('/services'),
    getAllSpecializations: (): Promise<AxiosResponse<SpecializationResponseDto[]>> => 
      api.get('/specializations'),
    getAllSpecialists: (): Promise<AxiosResponse<SpecialistResponseDto[]>> => 
      api.get('/specialists'),
  };
  