import { Status } from "./enum";
import { ServiceShortDto } from "./services";
import { AppointmentResponseDto } from "./appointment";
import { SpecializationShortDto } from "./specialization";
import { ReviewDto } from "./review";

export interface SpecialistRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  specializationIds: number[];
  serviceIds: number[];
  description: string;
  address: string;
  phone: string;
}

export interface SpecialistResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  specializations: SpecializationShortDto[];
  services: ServiceShortDto;
  description: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
}

export interface SpecialistShortDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SpecialistUpdateDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  specializationIds?: number[];
  serviceIds?: number[];
  description?: string;
  address?: string;
  phone?: string;
}

export interface SpecialistLoginRequestDto {
  email: string;
  password: string;
}

export interface SpecialistDetailedDto extends SpecialistResponseDto {
  appointments: AppointmentResponseDto[];
  review: ReviewDto[];
}

export const specialistValidation = {
  firstName: { min: 2, max: 20 },
  lastName: { min: 2, max: 20 },
  password: {
    min: 6,
    max: 20,
    pattern:
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])(?=\S+$).{8,}$/,
  },
  description: { min: 3, max: 510 },
  address: { max: 255 },
  phone: { pattern: /^\+?[0-9]{10,14}$/ },
};
