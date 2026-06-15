export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    password: string;
    email: string;
    role: UserRole;
}

export interface AuthResponse {
    jwt: string;
    id: number;
    username: string;
    email: string;
    role: UserRole;
}
