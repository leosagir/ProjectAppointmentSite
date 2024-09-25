import { AppointmentStatus } from "./enum";

export interface AppointmentCreateDto{
    specialistId: number;
    serviceId: number;
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
    specialistName: string;
    clientName: string;
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

