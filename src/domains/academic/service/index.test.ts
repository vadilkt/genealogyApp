import { sortAcademicByDate, filterOngoingStudies, getAcademicSummary } from './index';
import { mockAcademicProfile, mockAcademicProfiles } from '../api/mocks';

describe('Academic Service', () => {
    describe('sortAcademicByDate', () => {
        it('should sort by start date descending (most recent first)', () => {
            const sorted = sortAcademicByDate(mockAcademicProfiles);
            expect(sorted[0].id).toBe(1);
        });
    });

    describe('filterOngoingStudies', () => {
        it('should return only ongoing studies (endDate is null)', () => {
            const ongoing = filterOngoingStudies(mockAcademicProfiles);
            expect(ongoing).toHaveLength(0);
        });
    });

    describe('getAcademicSummary', () => {
        it('should return a summary string', () => {
            expect(getAcademicSummary(mockAcademicProfile)).toBe(
                'Master en Informatique — Université Paris-Saclay',
            );
        });
    });
});
