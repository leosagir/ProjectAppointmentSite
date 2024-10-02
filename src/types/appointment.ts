import { AppointmentStatus } from "./enum";

export interface AppointmentCreateDto{
    specialistId: number;
    startTime: string;
    endTime: string;
}

export interface AppointmentBookDto {
    clientId: number;
}

export interface AppointmentDto {
    id: number;
    specialistId: number;
    clientId: number;
    serviceId:number;
    startTime: string;
    endTime: string;
    appointmentStatus: AppointmentStatus
}

export interface AppointmentResponseDto {
    id: number;
    specialistId: number;
    specialistName: string;
    clientId: number;
    clientName: string;
    serviceId: number;
    serviceName: string;
    startTime: string;
    endTime: string;
    appointmentStatus: AppointmentStatus;
  }

export interface AppointmentUpdateDto {
    specialistId: number;
    clientId: number;
    serviceId: number;
    startTime: string;
    endTime: string;
    appointmentStatus: AppointmentStatus;
}


export { AppointmentStatus };
