import type { Profile, ValidationWarning } from '../types';

export const mockProfile: Profile = {
    id: 1,
    userId: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    gender: 'MALE',
    dateOfBirth: '1985-03-15T00:00:00Z',
    dateOfDeath: null,
    age: 41,
    residence: 'Paris',
    birthPlace: {
        id: 1,
        city: 'Paris',
        country: 'France',
        region: 'Île-de-France',
    },
    deathPlace: null,
    professionalRecords: [],
    academicRecords: [],
};

export const mockProfiles: Profile[] = [
    mockProfile,
    {
        id: 2,
        userId: 2,
        firstName: 'Marie',
        lastName: 'Dupont',
        gender: 'FEMALE',
        dateOfBirth: '1988-07-22T00:00:00Z',
        dateOfDeath: null,
        age: 37,
        residence: 'Lyon',
        birthPlace: {
            id: 2,
            city: 'Lyon',
            country: 'France',
            region: 'Auvergne-Rhône-Alpes',
        },
        deathPlace: null,
        professionalRecords: [],
        academicRecords: [],
    },
];

export const mockValidationWarnings: ValidationWarning[] = [
    {
        code: 'BIRTH_AFTER_DEATH',
        message: 'La date de naissance est postérieure à la date de décès.',
    },
];
