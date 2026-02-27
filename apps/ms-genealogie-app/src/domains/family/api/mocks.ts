import type { FamilyResponse, AncestorNode, DescendantNode, Marriage } from '../types';
import type { Profile } from '../../profiles/types';

const baseProfile: Profile = {
    id: 1,
    userId: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    gender: 'MALE',
    dateOfBirth: '1985-03-15T00:00:00Z',
    dateOfDeath: null,
    age: 41,
    residence: 'Paris',
    birthPlace: null,
    deathPlace: null,
    professionalRecords: [],
    academicRecords: [],
};

const fatherProfile: Profile = {
    ...baseProfile,
    id: 2,
    firstName: 'Pierre',
    dateOfBirth: '1955-01-10T00:00:00Z',
    age: 71,
};

const motherProfile: Profile = {
    ...baseProfile,
    id: 3,
    firstName: 'Marie',
    gender: 'FEMALE',
    dateOfBirth: '1958-06-20T00:00:00Z',
    age: 67,
};

export const mockMarriage: Marriage = {
    id: 1,
    husbandId: 1,
    wifeId: 4,
    husband: baseProfile,
    wife: { ...baseProfile, id: 4, firstName: 'Sophie', gender: 'FEMALE' },
    marriageDate: '2010-06-15T00:00:00Z',
    endDate: null,
};

export const mockFamilyResponse: FamilyResponse = {
    father: fatherProfile,
    mother: motherProfile,
    children: [],
    siblings: [],
    spouses: [{ ...baseProfile, id: 4, firstName: 'Sophie', gender: 'FEMALE' }],
    marriages: [mockMarriage],
};

export const mockAncestorNode: AncestorNode = {
    profile: baseProfile,
    father: {
        profile: fatherProfile,
        father: null,
        mother: null,
    },
    mother: {
        profile: motherProfile,
        father: null,
        mother: null,
    },
};

export const mockDescendantNode: DescendantNode = {
    profile: baseProfile,
    children: [],
};
