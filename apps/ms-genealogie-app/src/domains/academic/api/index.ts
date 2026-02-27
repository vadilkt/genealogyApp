import { apiClient } from '@/configs';

import { ACADEMIC_BASE_PATH } from '../consts';
import type { AcademicProfile, CreateAcademicPayload, UpdateAcademicPayload } from '../types';

export const createAcademic = async (
    profileId: number,
    payload: CreateAcademicPayload,
): Promise<AcademicProfile> => {
    const response = await apiClient.post<AcademicProfile>(
        `${ACADEMIC_BASE_PATH}/${profileId}/academic`,
        payload,
    );
    return response.data;
};

export const getAcademic = async (academicId: number): Promise<AcademicProfile> => {
    const response = await apiClient.get<AcademicProfile>(
        `${ACADEMIC_BASE_PATH}/academic/${academicId}`,
    );
    return response.data;
};

export const getAcademicsByProfile = async (profileId: number): Promise<AcademicProfile[]> => {
    const response = await apiClient.get<AcademicProfile[]>(
        `${ACADEMIC_BASE_PATH}/${profileId}/academic`,
    );
    return response.data;
};

export const updateAcademic = async (
    academicId: number,
    payload: UpdateAcademicPayload,
): Promise<AcademicProfile> => {
    const response = await apiClient.put<AcademicProfile>(
        `${ACADEMIC_BASE_PATH}/academic/${academicId}`,
        payload,
    );
    return response.data;
};

export const deleteAcademic = async (academicId: number): Promise<void> => {
    await apiClient.delete(`${ACADEMIC_BASE_PATH}/academic/${academicId}`);
};
