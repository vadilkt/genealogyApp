import type { Dayjs } from 'dayjs';

import type { Place } from '../places/types';
import type { ProfessionalProfile } from '../professional/types';
import type { AcademicProfile } from '../academic/types';

export interface Profile {
    id: number;
    userId: number | null;
    firstName: string | null;
    lastName: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    dateOfDeath: string | null;
    age: number | null;
    residence: string | null;
    birthPlace: Place | null;
    deathPlace: Place | null;
    professionalRecords: ProfessionalProfile[];
    academicRecords: AcademicProfile[];
    createdAt: string | null;
    updatedAt: string | null;
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

/** Nœud léger pour l'arbre généalogique global. */
export interface ProfileNode {
    id: number;
    firstName: string | null;
    lastName: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    dateOfDeath: string | null;
    fatherId: number | null;
    motherId: number | null;
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
