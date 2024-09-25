import {Status} from './enum';

export interface AdminLoginRequestDto {
    email: string;
    password: string;
}

export interface AdminRequestDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    phone: string;
}

export interface AdminResponseDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    status: Status;
}

export interface AdminUpdateDto{
firstName: string;
lastName: string;
dateOfBirth: string;
address: string;
phone: string;
}

export const adminValidation = {
    firstName: { min: 2, max: 20 },
    lastName: { min: 2, max: 20 },
    password: { min: 6, max: 20, pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])(?=\S+$).{8,}$/ },
    address: { max: 255 },
    phone: { pattern: /^\+?[0-9]{10,14}$/ }
  };