import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/configs';
import { PROFILES_QUERY_KEY } from '@/domains/profiles/consts';

import { getUsers } from '../api';
import { USERS_QUERY_KEY } from '../consts';

export const useUsers = () => {
    return useQuery({
        queryKey: [USERS_QUERY_KEY],
        queryFn: getUsers,
    });
};

export const useAssignUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ profileId, userId }: { profileId: number; userId: number | null }) =>
            apiClient.put(`/profile/${profileId}/user`, { userId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROFILES_QUERY_KEY] });
        },
    });
};
