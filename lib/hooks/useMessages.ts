'use client'

import {
    useMutation,
    useQuery,
    useQueryClient,
    useInfiniteQuery
} from "@tanstack/react-query";
import { getApiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useEffect, useCallback, useRef } from "react";
import io, { Socket } from "socket.io-client";

export function useMessages() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const socketRef = useRef<Socket | null>(null);

    // Initialiser la connexion WebSocket
    const initializeSocket = useCallback(() => {
        if (!session?.user || socketRef.current?.connected) return;

        socketRef.current = io(process.env.NEXT_PUBLIC_API_URL!, {
            auth: {
                token: (session?.user as any)?.token
            },
            transports: ["websocket"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        socketRef.current.on("message:new", (data) => {
            queryClient.invalidateQueries({
                queryKey: ["messages", data.conversationId]
            });
        });

        socketRef.current.on("message:updated", (data) => {
            queryClient.invalidateQueries({
                queryKey: ["messages", data.conversationId]
            });
        });

        socketRef.current.on("message:deleted", (data) => {
            queryClient.invalidateQueries({
                queryKey: ["messages", data.conversationId]
            });
        });

        socketRef.current.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });
    }, [session, queryClient]);

    // Récupérer les conversations
    const useConversations = () => {
        return useQuery({
            queryKey: ["conversations"],
            queryFn: async () => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );
                const { data } = await client.get("/api/v1/conversations");
                return data.data;
            },
            enabled: !!session?.user,
            staleTime: 5 * 60 * 1000,
            refetchInterval: 30 * 1000 // Refetch toutes les 30 secondes
        });
    };

    // Récupérer une conversation spécifique
    const useConversation = (conversationId: string) => {
        return useQuery({
            queryKey: ["conversations", conversationId],
            queryFn: async () => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );
                const { data } = await client.get(
                    `/api/v1/conversations/${conversationId}`
                );
                return data.data;
            },
            enabled: !!conversationId && !!session?.user,
            staleTime: 5 * 60 * 1000
        });
    };

    // Récupérer les messages avec pagination infinie
    const useMessagesInfinite = (conversationId: string) => {
        return useInfiniteQuery({
            queryKey: ["messages", conversationId],
            queryFn: async ({ pageParam = 1 }) => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );
                const { data } = await client.get(
                    `/api/v1/conversations/${conversationId}/messages`,
                    {
                        params: { page: pageParam, per_page: 50 }
                    }
                );
                return data.data;
            },
            getNextPageParam: (lastPage, pages) => {
                return lastPage.pagination?.hasMore ? pages.length + 1 : undefined;
            },
            enabled: !!conversationId && !!session?.user,
            refetchInterval: false
        });
    };

    // Envoyer un message
    const sendMessage = useMutation({
        mutationFn: async ({
                               conversationId,
                               content,
                               attachments
                           }: {
            conversationId: string;
            content: string;
            attachments?: File[];
        }) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );

            // Gérer les attachments
            let attachmentUrls: string[] = [];
            if (attachments && attachments.length > 0) {
                const formData = new FormData();
                attachments.forEach((file) => {
                    formData.append("files", file);
                });

                const uploadResponse = await client.post("/api/v1/uploads", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                attachmentUrls = uploadResponse.data.data;
            }

            const { data } = await client.post(
                `/api/v1/conversations/${conversationId}/messages`,
                {
                    content,
                    attachment_urls: attachmentUrls
                }
            );
            return data.data;
        },
        onSuccess: (newMessage, variables) => {
            // Emit via WebSocket pour update real-time
            if (socketRef.current?.connected) {
                socketRef.current.emit("message:send", newMessage);
            }

            queryClient.invalidateQueries({
                queryKey: ["messages", variables.conversationId]
            });

            toast({
                title: "Succès",
                description: "Message envoyé",
                variant: "default"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Erreur lors de l'envoi",
                variant: "destructive"
            });
        }
    });

    // Marquer les messages comme lus
    const markAsRead = useMutation({
        mutationFn: async (conversationId: string) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const { data } = await client.patch(
                `/api/v1/conversations/${conversationId}/mark-as-read`
            );
            return data.data;
        },
        onSuccess: (_, conversationId) => {
            queryClient.invalidateQueries({
                queryKey: ["conversations", conversationId]
            });
        }
    });

    // Créer une conversation
    const createConversation = useMutation({
        mutationFn: async (participantIds: string[]) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const { data } = await client.post("/api/v1/conversations", {
                participant_ids: participantIds
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
    });

    // Supprimer un message
    const deleteMessage = useMutation({
        mutationFn: async (messageId: string) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            await client.delete(`/api/v1/messages/${messageId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages"] });
            toast({
                title: "Succès",
                description: "Message supprimé",
                variant: "default"
            });
        }
    });

    // Effect pour initialiser le socket
    useEffect(() => {
        initializeSocket();

        return () => {
            if (socketRef.current?.connected) {
                socketRef.current.disconnect();
            }
        };
    }, [initializeSocket]);

    return {
        useConversations,
        useConversation,
        useMessagesInfinite,
        sendMessage,
        markAsRead,
        createConversation,
        deleteMessage,
        socket: socketRef.current
    };
}