import { SpecialistShortDto } from "./specialists";
import { SpecializationShortDto } from "./specialization";

export interface ServiceRequestDto {
  title: string;
  description: string;
  duration: number;
  price: string;
  specializationId: number;
}

export interface ServiceShortDto {
  id: number;
  title: string;
  duration: number;
  price: string;
}

export interface ServiceResponseDto {
  id: number;
  title: string;
  description: string;
  duration: number;
  price: string;
  createdAt: string;
  updatedAt: string;
  specialization: SpecializationShortDto;
  specialists: SpecialistShortDto[];
}

export interface ServiceUpdateDto {
  title?: string;
  description?: string;
  duration?: number;
  price?: string;
  specialisazionId?: number;
}

export interface ServiceWithSpecialistDto extends ServiceResponseDto {
  specialists: SpecialistShortDto[];
}
