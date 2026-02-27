import { sortProfessionalByDate, filterCurrentPositions, getProfessionalSummary } from './index';
import { mockProfessionalProfile, mockProfessionalProfiles } from '../api/mocks';

describe('Professional Service', () => {
    describe('sortProfessionalByDate', () => {
        it('should sort by date descending (most recent first)', () => {
            const sorted = sortProfessionalByDate(mockProfessionalProfiles);
            expect(sorted[0].id).toBe(2);
        });
    });

    describe('filterCurrentPositions', () => {
        it('should return only current positions (dateFin is null)', () => {
            const current = filterCurrentPositions(mockProfessionalProfiles);
            expect(current).toHaveLength(1);
            expect(current[0].profession).toBe('Architecte');
        });
    });

    describe('getProfessionalSummary', () => {
        it('should return a summary string', () => {
            expect(getProfessionalSummary(mockProfessionalProfile)).toBe(
                'Ingénieur chez TechCorp, Paris',
            );
        });
    });
});
