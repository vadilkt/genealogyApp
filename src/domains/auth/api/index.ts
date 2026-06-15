import { AUTH_BASE_PATH } from '../consts';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';

import { apiClient } from '@/configs';


export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(`${AUTH_BASE_PATH}/login`, payload);
    return response.data;
};

export const register = async (payload: RegisterPayload): Promise<string> => {
    const response = await apiClient.post<string>(`${AUTH_BASE_PATH}/register`, payload);
    return response.data;
};
