import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createPlace, getPlaces, getPlace } from '../api';
import { PLACES_QUERY_KEY } from '../consts';
import type { CreatePlacePayload } from '../types';

export const usePlaces = () => {
    return useQuery({
        queryKey: [PLACES_QUERY_KEY],
        queryFn: getPlaces,
    });
};

export const usePlace = (id: number) => {
    return useQuery({
        queryKey: [PLACES_QUERY_KEY, id],
        queryFn: () => getPlace(id),
        enabled: !!id,
    });
};

export const useCreatePlace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreatePlacePayload) => createPlace(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PLACES_QUERY_KEY] });
        },
    });
};
