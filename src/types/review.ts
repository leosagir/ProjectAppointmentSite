export interface ReviewCreateDto {
    specialistId: number;
    clientId: number;
    appointmentId: number;
    rating: number;
    comment: string;
}

export interface ReviewDto {
    id: number;
    specialistId: number;
    clientId: number;
    appointmentId: number;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ReviewResponseDto {
    id: number;
    specialistName: string;
    clientName: string;
    appointmentDate: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ReviewUpdateDto {
    rating?: number;
    comment?: string;
}