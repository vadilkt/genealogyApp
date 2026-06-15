import { apiClient } from '@/configs';
import { toArray } from '@/utils';

import { FAMILY_BASE_PATH } from '../consts';
import type {
    AncestorNode,
    CreateMarriagePayload,
    DescendantNode,
    FamilyResponse,
    Marriage,
    SetParentPayload,
} from '../types';
import type { Profile } from '../../profiles/types';

// --- Lecture de l'arbre familial ---

export const getFamily = async (profileId: number): Promise<FamilyResponse> => {
    const response = await apiClient.get<FamilyResponse>(`${FAMILY_BASE_PATH}/${profileId}/family`);
    const data = response.data;
    return {
        ...data,
        children: Array.isArray(data.children) ? data.children : [],
        siblings: Array.isArray(data.siblings) ? data.siblings : [],
        spouses: Array.isArray(data.spouses) ? data.spouses : [],
        marriages: Array.isArray(data.marriages) ? data.marriages : [],
    };
};

export const getAncestors = async (profileId: number, depth = 5): Promise<AncestorNode> => {
    const response = await apiClient.get<AncestorNode>(
        `${FAMILY_BASE_PATH}/${profileId}/ancestors?depth=${depth}`,
    );
    return response.data;
};

export const getDescendants = async (profileId: number, depth = 5): Promise<DescendantNode> => {
    const response = await apiClient.get<DescendantNode>(
        `${FAMILY_BASE_PATH}/${profileId}/descendants?depth=${depth}`,
    );
    return response.data;
};

export const getParents = async (profileId: number): Promise<FamilyResponse> => {
    const response = await apiClient.get<FamilyResponse>(
        `${FAMILY_BASE_PATH}/${profileId}/parents`,
    );
    return response.data;
};

export const getChildren = async (profileId: number): Promise<Profile[]> => {
    const response = await apiClient.get<unknown>(
        `${FAMILY_BASE_PATH}/${profileId}/children`,
    );
    return toArray<Profile>(response.data);
};

export const getSpouses = async (profileId: number): Promise<Profile[]> => {
    const response = await apiClient.get<unknown>(
        `${FAMILY_BASE_PATH}/${profileId}/spouses`,
    );
    return toArray<Profile>(response.data);
};

export const getSiblings = async (profileId: number): Promise<Profile[]> => {
    const response = await apiClient.get<unknown>(
        `${FAMILY_BASE_PATH}/${profileId}/siblings`,
    );
    return toArray<Profile>(response.data);
};

// --- Mutation des liens parentaux ---

export const setFather = async (profileId: number, payload: SetParentPayload): Promise<Profile> => {
    const response = await apiClient.put<Profile>(
        `${FAMILY_BASE_PATH}/${profileId}/father`,
        payload,
    );
    return response.data;
};

export const setMother = async (profileId: number, payload: SetParentPayload): Promise<Profile> => {
    const response = await apiClient.put<Profile>(
        `${FAMILY_BASE_PATH}/${profileId}/mother`,
        payload,
    );
    return response.data;
};

export const removeFather = async (profileId: number): Promise<void> => {
    await apiClient.delete(`${FAMILY_BASE_PATH}/${profileId}/father`);
};

export const removeMother = async (profileId: number): Promise<void> => {
    await apiClient.delete(`${FAMILY_BASE_PATH}/${profileId}/mother`);
};

// --- Mariages ---

export const addMarriage = async (
    profileId: number,
    payload: CreateMarriagePayload,
): Promise<Marriage> => {
    const response = await apiClient.post<Marriage>(
        `${FAMILY_BASE_PATH}/${profileId}/marriage`,
        payload,
    );
    return response.data;
};

export const removeMarriage = async (marriageId: number): Promise<void> => {
    await apiClient.delete(`${FAMILY_BASE_PATH}/marriage/${marriageId}`);
};
