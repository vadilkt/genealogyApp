import { apiClient } from '@/configs';
import { toArray } from '@/utils';

import { PROFILES_BASE_PATH } from '../consts';
import type { CreateProfilePayload, Profile, ProfileNode, UpdateProfilePayload, ValidationWarning } from '../types';

export const createProfile = async (payload: CreateProfilePayload): Promise<Profile> => {
    const response = await apiClient.post<Profile>(PROFILES_BASE_PATH, payload);
    return response.data;
};

export const getProfile = async (id: number): Promise<Profile> => {
    const response = await apiClient.get<Profile>(`${PROFILES_BASE_PATH}/${id}`);
    const data = response.data;
    return {
        ...data,
        professionalRecords: Array.isArray(data.professionalRecords) ? data.professionalRecords : [],
        academicRecords: Array.isArray(data.academicRecords) ? data.academicRecords : [],
    };
};

export const searchProfiles = async (keyword?: string): Promise<Profile[]> => {
    const params = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
    const response = await apiClient.get<unknown>(`${PROFILES_BASE_PATH}/search${params}`);
    const data = response.data;
    if (Array.isArray(data)) return data as Profile[];
    if (data && typeof data === 'object' && 'content' in data && Array.isArray((data as Record<string, unknown>).content)) {
        return (data as { content: Profile[] }).content;
    }
    return [];
};

export const updateProfile = async (id: number, payload: UpdateProfilePayload): Promise<Profile> => {
    const response = await apiClient.put<Profile>(`${PROFILES_BASE_PATH}/${id}`, payload);
    return response.data;
};

export const deleteProfile = async (id: number): Promise<void> => {
    await apiClient.delete(`${PROFILES_BASE_PATH}/${id}`);
};

export const getProfileWarnings = async (id: number): Promise<ValidationWarning[]> => {
    const response = await apiClient.get<unknown>(`${PROFILES_BASE_PATH}/${id}/warnings`);
    return toArray<ValidationWarning>(response.data);
};

export const getFamilyGraph = async (): Promise<ProfileNode[]> => {
    const response = await apiClient.get<unknown>(`${PROFILES_BASE_PATH}/family-graph`);
    return toArray<ProfileNode>(response.data);
};

export const getOrphanProfiles = async (): Promise<Profile[]> => {
    const response = await apiClient.get<unknown>(`${PROFILES_BASE_PATH}/orphans`);
    return toArray<Profile>(response.data);
};

export const getMyProfile = async (): Promise<Profile | null> => {
    try {
        const response = await apiClient.get<Profile>(`${PROFILES_BASE_PATH}/me`);
        return response.data ?? null;
    } catch {
        return null;
    }
};
