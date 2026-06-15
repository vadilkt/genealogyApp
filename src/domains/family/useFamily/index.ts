import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
    getFamily,
    getAncestors,
    getDescendants,
    getParents,
    getChildren,
    getSpouses,
    getSiblings,
    setFather,
    setMother,
    removeFather,
    removeMother,
    addMarriage,
    removeMarriage,
} from '../api';
import { FAMILY_QUERY_KEY } from '../consts';
import type { CreateMarriagePayload, SetParentPayload } from '../types';

// --- Queries ---

export const useFamily = (profileId: number) => {
    return useQuery({
        queryKey: [FAMILY_QUERY_KEY, profileId],
        queryFn: () => getFamily(profileId),
        enabled: !!profileId,
    });
};

export const useAncestors = (profileId: number, depth = 5) => {
    return useQuery({
        queryKey: [FAMILY_QUERY_KEY, 'ancestors', profileId, depth],
        queryFn: () => getAncestors(profileId, depth),
        enabled: !!profileId,
    });
};

export const useDescendants = (profileId: number, depth = 5) => {
    return useQuery({
        queryKey: [FAMILY_QUERY_KEY, 'descendants', profileId, depth],
        queryFn: () => getDescendants(profileId, depth),
        enabled: !!profileId,
    });
};

export const useParents = (profileId: number) => {
    return useQuery({
        queryKey: [FAMILY_QUERY_KEY, 'parents', profileId],
        queryFn: () => getParents(profileId),
        enabled: !!profileId,
    });
};

export const useChildren = (profileId: number) => {
    return useQuery({
        queryKey: [FAMILY_QUERY_KEY, 'children', profileId],
        queryFn: () => getChildren(profileId),
        enabled: !!profileId,
    });
};

export const useSpouses = (profileId: number) => {
    return useQuery({
        queryKey: [FAMILY_QUERY_KEY, 'spouses', profileId],
        queryFn: () => getSpouses(profileId),
        enabled: !!profileId,
    });
};

export const useSiblings = (profileId: number) => {
    return useQuery({
        queryKey: [FAMILY_QUERY_KEY, 'siblings', profileId],
        queryFn: () => getSiblings(profileId),
        enabled: !!profileId,
    });
};

// --- Mutations ---

export const useSetFather = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ profileId, payload }: { profileId: number; payload: SetParentPayload }) =>
            setFather(profileId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [FAMILY_QUERY_KEY] });
        },
    });
};

export const useSetMother = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ profileId, payload }: { profileId: number; payload: SetParentPayload }) =>
            setMother(profileId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [FAMILY_QUERY_KEY] });
        },
    });
};

export const useRemoveFather = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (profileId: number) => removeFather(profileId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [FAMILY_QUERY_KEY] });
        },
    });
};

export const useRemoveMother = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (profileId: number) => removeMother(profileId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [FAMILY_QUERY_KEY] });
        },
    });
};

export const useAddMarriage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            profileId,
            payload,
        }: {
            profileId: number;
            payload: CreateMarriagePayload;
        }) => addMarriage(profileId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [FAMILY_QUERY_KEY] });
        },
    });
};

export const useRemoveMarriage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (marriageId: number) => removeMarriage(marriageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [FAMILY_QUERY_KEY] });
        },
    });
};
