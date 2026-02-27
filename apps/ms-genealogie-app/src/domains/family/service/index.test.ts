import {
    flattenAncestors,
    flattenDescendants,
    countAncestorGenerations,
    countDescendantGenerations,
} from './index';
import { mockAncestorNode, mockDescendantNode } from '../api/mocks';

describe('Family Service', () => {
    describe('flattenAncestors', () => {
        it('should flatten ancestor tree to list of profiles', () => {
            const profiles = flattenAncestors(mockAncestorNode);
            expect(profiles).toHaveLength(3); // self + father + mother
        });

        it('should return empty array for null node', () => {
            expect(flattenAncestors(null)).toEqual([]);
        });
    });

    describe('flattenDescendants', () => {
        it('should flatten descendant tree to list of profiles', () => {
            const profiles = flattenDescendants(mockDescendantNode);
            expect(profiles).toHaveLength(1); // only self (no children)
        });

        it('should return empty array for null node', () => {
            expect(flattenDescendants(null)).toEqual([]);
        });
    });

    describe('countAncestorGenerations', () => {
        it('should count generations in ancestor tree', () => {
            expect(countAncestorGenerations(mockAncestorNode)).toBe(2);
        });

        it('should return 0 for null', () => {
            expect(countAncestorGenerations(null)).toBe(0);
        });
    });

    describe('countDescendantGenerations', () => {
        it('should count generations in descendant tree', () => {
            expect(countDescendantGenerations(mockDescendantNode)).toBe(1);
        });

        it('should return 0 for null', () => {
            expect(countDescendantGenerations(null)).toBe(0);
        });
    });
});
