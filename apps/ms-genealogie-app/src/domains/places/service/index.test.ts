import { sortPlacesByCity, filterPlacesByCountry, getPlaceDisplayName } from './index';
import { mockPlace, mockPlaces } from '../api/mocks';

describe('Places Service', () => {
    describe('sortPlacesByCity', () => {
        it('should sort places by city name', () => {
            const sorted = sortPlacesByCity(mockPlaces);
            expect(sorted[0].city).toBe('Bruxelles');
            expect(sorted[1].city).toBe('Lyon');
            expect(sorted[2].city).toBe('Paris');
        });
    });

    describe('filterPlacesByCountry', () => {
        it('should filter places by country', () => {
            const result = filterPlacesByCountry(mockPlaces, 'France');
            expect(result).toHaveLength(2);
        });

        it('should filter places by non-French country', () => {
            const result = filterPlacesByCountry(mockPlaces, 'Belgique');
            expect(result).toHaveLength(1);
            expect(result[0].city).toBe('Bruxelles');
        });
    });

    describe('getPlaceDisplayName', () => {
        it('should return city, region, country when region exists', () => {
            expect(getPlaceDisplayName(mockPlace)).toBe('Paris, Île-de-France, France');
        });

        it('should return city, country when region is null', () => {
            expect(getPlaceDisplayName(mockPlaces[2])).toBe('Bruxelles, Belgique');
        });
    });
});
