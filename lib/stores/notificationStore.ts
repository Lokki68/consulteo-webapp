import { create } from "zustand";

export interface Notification {
    id: string;
    userId: string;
    type: "appointment" | "message" | "alert" | "system";
    title: string;
    message: string;
    read: boolean;
    relatedId?: string; // ID de la ressource associée (appointment, message, etc.)
    createdAt: string;
    actionUrl?: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;

    // Actions
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    deleteAllNotifications: () => void;
    setLoading: (loading: boolean) => void;
    getUnreadCount: () => number;
    getNotificationsByType: (type: Notification["type"]) => Notification[];
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    setNotifications: (notifications) =>
        set({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
        }),

    addNotification: (notification) =>
        set((state) => {
            const updated = [notification, ...state.notifications];
            return {
                notifications: updated,
                unreadCount: updated.filter((n) => !n.read).length,
            };
        }),

    markAsRead: (id) =>
        set((state) => {
            const updated = state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            );
            return {
                notifications: updated,
                unreadCount: updated.filter((n) => !n.read).length,
            };
        }),

    markAllAsRead: () =>
        set((state) => {
            const updated = state.notifications.map((n) => ({
                ...n,
                read: true,
            }));
            return {
                notifications: updated,
                unreadCount: 0,
            };
        }),

    deleteNotification: (id) =>
        set((state) => {
            const updated = state.notifications.filter((n) => n.id !== id);
            return {
                notifications: updated,
                unreadCount: updated.filter((n) => !n.read).length,
            };
        }),

    deleteAllNotifications: () =>
        set({
            notifications: [],
            unreadCount: 0,
        }),

    setLoading: (loading) =>
        set({
            isLoading: loading,
        }),

    getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
    },

    getNotificationsByType: (type) => {
        return get().notifications.filter((n) => n.type === type);
    },
}));