import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';
import { UserRole } from '../types';

export const mockLoginPayload: LoginPayload = {
    username: 'johndoe',
    password: 'password123',
};

export const mockRegisterPayload: RegisterPayload = {
    username: 'johndoe',
    password: 'password123',
    email: 'john@example.com',
    role: UserRole.USER,
};

export const mockAuthResponse: AuthResponse = {
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token',
    id: 1,
    username: 'johndoe',
    email: 'john@example.com',
    role: UserRole.USER,
};
