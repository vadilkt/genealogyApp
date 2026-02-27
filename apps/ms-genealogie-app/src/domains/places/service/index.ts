import type { Place } from '../types';

export const sortPlacesByCity = (places: Place[]): Place[] => {
    return [...places].sort((a, b) => a.city.localeCompare(b.city));
};

export const filterPlacesByCountry = (places: Place[], country: string): Place[] => {
    return places.filter((place) => place.country === country);
};

export const getPlaceDisplayName = (place: Place): string => {
    if (place.region) {
        return `${place.city}, ${place.region}, ${place.country}`;
    }
    return `${place.city}, ${place.country}`;
};
