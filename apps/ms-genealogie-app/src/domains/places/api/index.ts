import { apiClient } from '@/configs';

import { PLACES_BASE_PATH } from '../consts';
import type { CreatePlacePayload, Place } from '../types';

export const createPlace = async (payload: CreatePlacePayload): Promise<Place> => {
    const response = await apiClient.post<Place>(PLACES_BASE_PATH, payload);
    return response.data;
};

export const getPlaces = async (): Promise<Place[]> => {
    const response = await apiClient.get<Place[]>(PLACES_BASE_PATH);
    return response.data;
};

export const getPlace = async (id: number): Promise<Place> => {
    const response = await apiClient.get<Place>(`${PLACES_BASE_PATH}/${id}`);
    return response.data;
};
