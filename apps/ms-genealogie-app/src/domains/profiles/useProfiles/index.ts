import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createProfile,
    getFamilyGraph,
    getMyProfile,
    getOrphanProfiles,
    getProfile,
    getProfileWarnings,
    searchProfiles,
    updateProfile,
    deleteProfile,
} from '../api';
import { PROFILES_QUERY_KEY } from '../consts';
import type { CreateProfilePayload, UpdateProfilePayload } from '../types';

export const useProfile = (id: number) => {
    return useQuery({
        queryKey: [PROFILES_QUERY_KEY, id],
        queryFn: () => getProfile(id),
        enabled: !!id,
    });
};

export const useSearchProfiles = (keyword?: string) => {
    return useQuery({
        queryKey: [PROFILES_QUERY_KEY, 'search', keyword],
        queryFn: () => searchProfiles(keyword),
    });
};

export const useCreateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateProfilePayload) => createProfile(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROFILES_QUERY_KEY] });
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateProfilePayload }) =>
            updateProfile(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROFILES_QUERY_KEY] });
        },
    });
};

export const useDeleteProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteProfile(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROFILES_QUERY_KEY] });
        },
    });
};

export const useMyProfile = () => {
    return useQuery({
        queryKey: [PROFILES_QUERY_KEY, 'me'],
        queryFn: getMyProfile,
    });
};

export const useFamilyGraph = () =>
    useQuery({
        queryKey: [PROFILES_QUERY_KEY, 'family-graph'],
        queryFn: getFamilyGraph,
    });

export const useOrphanProfiles = () =>
    useQuery({
        queryKey: [PROFILES_QUERY_KEY, 'orphans'],
        queryFn: getOrphanProfiles,
    });

export const useProfileWarnings = (id: number) => {
    return useQuery({
        queryKey: [PROFILES_QUERY_KEY, id, 'warnings'],
        queryFn: () => getProfileWarnings(id),
        enabled: !!id,
    });
};
