import { HttpClient } from '@ms-genealogie/services';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api';

export const apiClient = new HttpClient({
    baseUrl: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token: string) => {
    apiClient.setHeader('Authorization', `Bearer ${token}`);
};

export const clearAuthToken = () => {
    apiClient.removeHeader('Authorization');
};
