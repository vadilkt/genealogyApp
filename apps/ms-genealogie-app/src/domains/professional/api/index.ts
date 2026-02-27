import { apiClient } from '@/configs';

import { PROFESSIONAL_BASE_PATH } from '../consts';
import type { CreateProfessionalPayload, ProfessionalProfile, UpdateProfessionalPayload } from '../types';

export const createProfessional = async (
    profileId: number,
    payload: CreateProfessionalPayload,
): Promise<ProfessionalProfile> => {
    const response = await apiClient.post<ProfessionalProfile>(
        `${PROFESSIONAL_BASE_PATH}/${profileId}/professional`,
        payload,
    );
    return response.data;
};

export const getProfessional = async (professionalId: number): Promise<ProfessionalProfile> => {
    const response = await apiClient.get<ProfessionalProfile>(
        `${PROFESSIONAL_BASE_PATH}/professional/${professionalId}`,
    );
    return response.data;
};

export const getProfessionalsByProfile = async (profileId: number): Promise<ProfessionalProfile[]> => {
    const response = await apiClient.get<ProfessionalProfile[]>(
        `${PROFESSIONAL_BASE_PATH}/${profileId}/professional`,
    );
    return response.data;
};

export const updateProfessional = async (
    professionalId: number,
    payload: UpdateProfessionalPayload,
): Promise<ProfessionalProfile> => {
    const response = await apiClient.put<ProfessionalProfile>(
        `${PROFESSIONAL_BASE_PATH}/professional/${professionalId}`,
        payload,
    );
    return response.data;
};

export const deleteProfessional = async (professionalId: number): Promise<void> => {
    await apiClient.delete(`${PROFESSIONAL_BASE_PATH}/professional/${professionalId}`);
};
