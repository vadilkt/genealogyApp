import type { Dayjs } from 'dayjs';

import type { Place } from '../places/types';
import type { ProfessionalProfile } from '../professional/types';
import type { AcademicProfile } from '../academic/types';

export interface Profile {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    dateOfDeath: string | null;
    age: number | null;
    residence: string;
    birthPlace: Place | null;
    deathPlace: Place | null;
    professionalRecords: ProfessionalProfile[];
    academicRecords: AcademicProfile[];
}

export interface CreateProfilePayload {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    dateOfDeath?: string | null;
    residence: string;
    birthPlaceId?: number | null;
    deathPlaceId?: number | null;
}

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    gender?: string;
    dateOfBirth?: string;
    dateOfDeath?: string | null;
    residence?: string;
    birthPlaceId?: number | null;
    deathPlaceId?: number | null;
}

export interface ValidationWarning {
    code: string;
    message: string;
}

export interface ProfileFormValues {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Dayjs;
    dateOfDeath?: Dayjs | null;
    residence: string;
    birthPlaceId?: number;
    deathPlaceId?: number;
}
