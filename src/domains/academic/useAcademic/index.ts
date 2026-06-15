import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createAcademic,
    getAcademic,
    getAcademicsByProfile,
    updateAcademic,
    deleteAcademic,
} from '../api';
import { ACADEMIC_QUERY_KEY } from '../consts';
import type { CreateAcademicPayload, UpdateAcademicPayload } from '../types';

export const useAcademic = (academicId: number) => {
    return useQuery({
        queryKey: [ACADEMIC_QUERY_KEY, academicId],
        queryFn: () => getAcademic(academicId),
        enabled: !!academicId,
    });
};

export const useAcademicsByProfile = (profileId: number) => {
    return useQuery({
        queryKey: [ACADEMIC_QUERY_KEY, 'byProfile', profileId],
        queryFn: () => getAcademicsByProfile(profileId),
        enabled: !!profileId,
    });
};

export const useCreateAcademic = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ profileId, payload }: { profileId: number; payload: CreateAcademicPayload }) =>
            createAcademic(profileId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ACADEMIC_QUERY_KEY] });
        },
    });
};

export const useUpdateAcademic = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            academicId,
            payload,
        }: {
            academicId: number;
            payload: UpdateAcademicPayload;
        }) => updateAcademic(academicId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ACADEMIC_QUERY_KEY] });
        },
    });
};

export const useDeleteAcademic = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (academicId: number) => deleteAcademic(academicId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ACADEMIC_QUERY_KEY] });
        },
    });
};
