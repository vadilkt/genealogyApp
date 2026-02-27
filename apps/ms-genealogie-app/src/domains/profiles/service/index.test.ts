import { sortProfilesByName, filterProfilesByGender, getFullName, isDeceased } from './index';
import { mockProfiles, mockProfile } from '../api/mocks';

describe('Profiles Service', () => {
    describe('sortProfilesByName', () => {
        it('should sort profiles by last name', () => {
            const sorted = sortProfilesByName(mockProfiles);
            expect(sorted[0].lastName).toBe('Dupont');
        });
    });

    describe('filterProfilesByGender', () => {
        it('should filter profiles by gender', () => {
            const males = filterProfilesByGender(mockProfiles, 'MALE');
            expect(males).toHaveLength(1);
            expect(males[0].firstName).toBe('Jean');
        });
    });

    describe('getFullName', () => {
        it('should return full name', () => {
            expect(getFullName(mockProfile)).toBe('Jean Dupont');
        });
    });

    describe('isDeceased', () => {
        it('should return false for living profile', () => {
            expect(isDeceased(mockProfile)).toBe(false);
        });

        it('should return true for deceased profile', () => {
            expect(isDeceased({ ...mockProfile, dateOfDeath: '2020-01-01T00:00:00Z' })).toBe(true);
        });
    });
});
