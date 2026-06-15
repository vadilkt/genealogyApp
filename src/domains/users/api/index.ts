import { apiClient } from '@/configs';
import { toArray } from '@/utils';

import { USERS_BASE_PATH } from '../consts';
import type { AppUser } from '../types';

export const getUsers = async (): Promise<AppUser[]> => {
    const response = await apiClient.get<unknown>(USERS_BASE_PATH);
    return toArray<AppUser>(response.data);
};

export const changePassword = async (userId: number, newPassword: string): Promise<void> => {
    await apiClient.put(`${USERS_BASE_PATH}/${userId}/password`, { newPassword });
};
