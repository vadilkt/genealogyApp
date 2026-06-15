import { apiClient } from '@/configs';

import type { AppNotification } from '../types';

export const getNotifications = async (): Promise<AppNotification[]> => {
    const res = await apiClient.get<AppNotification[]>('/notifications');
    return res.data;
};

export const getUnreadCount = async (): Promise<number> => {
    const res = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return res.data.count;
};

export const markAllRead = async (): Promise<void> => {
    await apiClient.put('/notifications/read');
};
