import { isAdmin, getDisplayRole } from './index';

describe('Auth Service', () => {
    describe('isAdmin', () => {
        it('should return true for ADMIN role', () => {
            expect(isAdmin('ADMIN')).toBe(true);
        });

        it('should return false for USER role', () => {
            expect(isAdmin('USER')).toBe(false);
        });
    });

    describe('getDisplayRole', () => {
        it('should return Administrateur for ADMIN', () => {
            expect(getDisplayRole('ADMIN')).toBe('Administrateur');
        });

        it('should return Utilisateur for USER', () => {
            expect(getDisplayRole('USER')).toBe('Utilisateur');
        });

        it('should return the role as-is for unknown roles', () => {
            expect(getDisplayRole('UNKNOWN')).toBe('UNKNOWN');
        });
    });
});
