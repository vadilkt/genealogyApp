import type { Profile } from '../types';

export const sortProfilesByName = (profiles: Profile[]): Profile[] => {
    return [...profiles].sort((a, b) => a.lastName.localeCompare(b.lastName));
};

export const filterProfilesByGender = (profiles: Profile[], gender: string): Profile[] => {
    return profiles.filter((profile) => profile.gender === gender);
};

export const getFullName = (profile: Profile): string => {
    return `${profile.firstName} ${profile.lastName}`;
};

export const isDeceased = (profile: Profile): boolean => {
    return profile.dateOfDeath !== null;
};
