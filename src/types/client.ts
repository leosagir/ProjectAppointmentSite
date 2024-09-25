import { Status } from "./enum";

export interface ClientLoginRequestDto {
    email: string;
    password: string;
}

export interface ClientRequestDto {
    email: string;
    password: string;
    firstName: string;
    lastName:string;
    dateOfBirth: string;
    address: string;
    phone: string;
}

export interface ClientResponseDto {
    id: number;
    email: string;
    firstName: string;
    lastName:string;
    dateOfBirth: string;
    address: string;
    phone: string;
    createdAt: string;
    updateAt: string;
    status: Status;
}

export interface ClientShortRequestDto {
    clientId: number;
    firstName: string;
    lastName: string;
}

export interface ClientShortResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface ClientUpdateDto {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    phone: string;
}

export const clientValidation = {
    firstName: { min: 2, max: 20 },
    lastName: { min: 2, max: 20 },
    password: { min: 6, max: 20, pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])(?=\S+$).{8,}$/ },
    address: { max: 255 },
    phone: { pattern: /^\+?[0-9]{10,14}$/ }
  };