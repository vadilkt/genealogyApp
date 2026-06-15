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
    birthDateQualifier: string | null;
    birthDatePrecision: string | null;
    deathDateQualifier: string | null;
    deathDatePrecision: string | null;
    age: number | null;
    residence: string | null;
    birthPlace: Place | null;
    deathPlace: Place | null;
    professionalRecords: ProfessionalProfile[];
    academicRecords: AcademicProfile[];
    createdAt: string | null;
    updatedAt: string | null;
}

export interface DateMetaPayload {
    birthDateQualifier?: string;
    birthDatePrecision?: string;
    deathDateQualifier?: string;
    deathDatePrecision?: string;
}

export interface CreateProfilePayload extends DateMetaPayload {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    dateOfDeath?: string | null;
    residence: string;
    birthPlaceId?: number | null;
    deathPlaceId?: number | null;
}

export interface UpdateProfilePayload extends DateMetaPayload {
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
    birthDateQualifier?: string;
    birthDatePrecision?: string;
    deathDateQualifier?: string;
    deathDatePrecision?: string;
    residence: string;
    birthPlaceId?: number;
    deathPlaceId?: number;
}
