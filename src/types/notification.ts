import { NotificationStatus } from "./enum";

export interface NotificationRequestDto {
    clientId: number;
    appointmentId: number;
}

export interface NotificationResponseDto {
    message: any;
    id: number;
    clientId: number;
    clientFullName: string;
    appointmentId: number;
    appointmentDate: string;
    sentAt: string;
    status: NotificationStatus;
}