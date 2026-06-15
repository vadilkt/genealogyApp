import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createProfessional,
    getProfessional,
    getProfessionalsByProfile,
    updateProfessional,
    deleteProfessional,
} from '../api';
import { PROFESSIONAL_QUERY_KEY } from '../consts';
import type { CreateProfessionalPayload, UpdateProfessionalPayload } from '../types';

export const useProfessional = (professionalId: number) => {
    return useQuery({
        queryKey: [PROFESSIONAL_QUERY_KEY, professionalId],
        queryFn: () => getProfessional(professionalId),
        enabled: !!professionalId,
    });
};

export const useProfessionalsByProfile = (profileId: number) => {
    return useQuery({
        queryKey: [PROFESSIONAL_QUERY_KEY, 'byProfile', profileId],
        queryFn: () => getProfessionalsByProfile(profileId),
        enabled: !!profileId,
    });
};

export const useCreateProfessional = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ profileId, payload }: { profileId: number; payload: CreateProfessionalPayload }) =>
            createProfessional(profileId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROFESSIONAL_QUERY_KEY] });
        },
    });
};

export const useUpdateProfessional = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            professionalId,
            payload,
        }: {
            professionalId: number;
            payload: UpdateProfessionalPayload;
        }) => updateProfessional(professionalId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROFESSIONAL_QUERY_KEY] });
        },
    });
};

export const useDeleteProfessional = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (professionalId: number) => deleteProfessional(professionalId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROFESSIONAL_QUERY_KEY] });
        },
    });
};
