import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getNotifications, getUnreadCount, markAllRead } from '../api';

const NOTIFICATIONS_KEY = 'notifications';
const UNREAD_COUNT_KEY = 'notifications-unread';

export const useNotifications = () =>
    useQuery({
        queryKey: [NOTIFICATIONS_KEY],
        queryFn: getNotifications,
        refetchInterval: 30_000, // poll every 30s
    });

export const useUnreadCount = () =>
    useQuery({
        queryKey: [UNREAD_COUNT_KEY],
        queryFn: getUnreadCount,
        refetchInterval: 30_000,
    });

export const useMarkAllRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: markAllRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] });
            queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_KEY] });
        },
    });
};
