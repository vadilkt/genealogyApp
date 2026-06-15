export interface AppUser {
    id: number;
    username: string;
    email: string | null;
    role: 'ADMIN' | 'USER';
}
