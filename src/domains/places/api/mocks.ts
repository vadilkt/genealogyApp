import type { Place } from '../types';

export const mockPlace: Place = {
    id: 1,
    city: 'Paris',
    country: 'France',
    region: 'Île-de-France',
};

export const mockPlaces: Place[] = [
    mockPlace,
    {
        id: 2,
        city: 'Lyon',
        country: 'France',
        region: 'Auvergne-Rhône-Alpes',
    },
    {
        id: 3,
        city: 'Bruxelles',
        country: 'Belgique',
        region: null,
    },
];
