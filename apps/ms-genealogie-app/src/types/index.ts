// Global types
export interface AppUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface AppConfig {
    apiUrl: string;
    appName: string;
    version: string;
}
