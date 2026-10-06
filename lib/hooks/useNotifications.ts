'use client'

import { useCallback, useEffect } from "react";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import io, { Socket } from "socket.io-client";

export interface Notification {
    id: string;
    type: "appointment" | "message" | "system" | "warning";
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    actionUrl?: string;
}

export function useNotifications() {
    const { data: session } = useSession();
    const socketRef = useRef<Socket | null>(null);
    const {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        markAsRead
    } = useNotificationStore();

    // Initialiser WebSocket pour les notifications
    const initializeNotificationSocket = useCallback(() => {
        if (!session?.user || socketRef.current?.connected) return;

        socketRef.current = io(process.env.NEXT_PUBLIC_API_URL!, {
            auth: {
                token: (session?.user as any)?.token
            },
            transports: ["websocket"]
        });

        // Notification de rendez-vous
        socketRef.current.on("appointment:created", (data) => {
            addNotification({
                id: data.id,
                type: "appointment",
                title: "Nouveau rendez-vous",
                message: `Rendez-vous prévu avec ${data.practitionerName}`,
                read: false,
                createdAt: new Date(),
                actionUrl: `/dashboard/appointments/${data.appointmentId}`
            });
        });

        // Notification de rendez-vous modifié
        socketRef.current.on("appointment:rescheduled", (data) => {
            addNotification({
                id: data.id,
                type: "appointment",
                title: "Rendez-vous reprogrammé",
                message: `Votre rendez-vous a été reprogrammé`,
                read: false,
                createdAt: new Date(),
                actionUrl: `/dashboard/appointments/${data.appointmentId}`
            });
        });

        // Notification de message
        socketRef.current.on("message:received", (data) => {
            addNotification({
                id: data.messageId,
                type: "message",
                title: `Message de ${data.senderName}`,
                message: data.preview,
                read: false,
                createdAt: new Date(),
                actionUrl: `/dashboard/messaging/${data.conversationId}`
            });
        });

        // Notification système
        socketRef.current.on("system:notification", (data) => {
            addNotification({
                id: data.id,
                type: "system",
                title: data.title,
                message: data.message,
                read: false,
                createdAt: new Date()
            });
        });

        socketRef.current.on("connect_error", (error) => {
            console.error("Notification socket error:", error);
        });
    }, [session, addNotification]);

    // Marquer comme lu
    const markNotificationAsRead = useCallback((notificationId: string) => {
        markAsRead(notificationId);
    }, [markAsRead]);

    // Supprimer une notification
    const deleteNotification = useCallback((notificationId: string) => {
        removeNotification(notificationId);
    }, [removeNotification]);

    // Récupérer les non-lus
    const getUnreadCount = useCallback(() => {
        return notifications.filter((n) => !n.read).length;
    }, [notifications]);

    // Récupérer les notifications non-lues
    const getUnreadNotifications = useCallback(() => {
        return notifications.filter((n) => !n.read);
    }, [notifications]);

    // Effect pour initialiser le socket
    useEffect(() => {
        initializeNotificationSocket();

        return () => {
            if (socketRef.current?.connected) {
                socketRef.current.disconnect();
            }
        };
    }, [initializeNotificationSocket]);

    return {
        notifications,
        addNotification,
        removeNotification: deleteNotification,
        markAsRead: markNotificationAsRead,
        clearAll,
        getUnreadCount,
        getUnreadNotifications,
        socket: socketRef.current
    };
}