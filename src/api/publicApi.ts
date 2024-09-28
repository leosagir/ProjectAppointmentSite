import axios, { AxiosResponse } from "axios";
import { ClientRequestDto, ClientResponseDto } from "../types/client";
import { ServiceResponseDto } from "../types/services";
import { SpecializationResponseDto } from "../types/specialization";
import { SpecialistResponseDto } from "../types/specialists";

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicApi = {
    registerClient: (data: ClientRequestDto): Promise<AxiosResponse<ClientResponseDto>> => 
      api.post('/public/client/register', data),
    getAllServices: (): Promise<AxiosResponse<ServiceResponseDto[]>> => 
      api.get('/services'),
    getAllSpecializations: (): Promise<AxiosResponse<SpecializationResponseDto[]>> => 
      api.get('/specializations'),
    getAllSpecialists: (): Promise<AxiosResponse<SpecialistResponseDto[]>> => 
      api.get('/specialists'),
  };
  