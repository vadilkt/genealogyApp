import { UserRole } from '../types';

export const isAdmin = (role: string): boolean => {
    return role === UserRole.ADMIN;
};

export const getDisplayRole = (role: string): string => {
    switch (role) {
        case UserRole.ADMIN:
            return 'Administrateur';
        case UserRole.USER:
            return 'Utilisateur';
        default:
            return role;
    }
};
