import { SpecialistShortDto } from "./specialists";
import { ServiceShortDto } from "./services";

export interface SpecializationRequestDto {
  title: string;
}

export interface SpecializationResponseDto {
  id: number;
  title: string;
  specialists: SpecialistShortDto[];
  services: ServiceShortDto[];
}

export interface SpecializationShortDto {
  id: number;
  title: string;
}

export interface SpecializationUpdateDto {
  title: string;
}
