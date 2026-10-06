'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";

export interface AvailabilityInput {
    dayOfWeek: number; // 0-6
    startTime: string; // HH:mm
    endTime: string; // HH:mm
}

export interface UnavailabilityInput {
    startDate: Date;
    endDate: Date;
    reason: string;
}

export function useAvailability() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Récupérer les disponibilités
    const usePractitionerAvailability = (practitionerId?: string) => {
        return useQuery({
            queryKey: ["availability", practitionerId || session?.user?.id],
            queryFn: async () => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );
                const endpoint = practitionerId
                    ? `/api/v1/practitioners/${practitionerId}/availability`
                    : "/api/v1/practitioners/availability";

                const { data } = await client.get(endpoint);
                return data.data;
            },
            enabled: !!(
                session?.user &&
                (practitionerId || session?.user?.role === "practitioner")
            ),
            staleTime: 60 * 60 * 1000 // 1 heure
        });
    };

    // Créer une disponibilité
    const createAvailability = useMutation({
        mutationFn: async (input: AvailabilityInput) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const { data } = await client.post(
                "/api/v1/practitioners/availability",
                input
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["availability", session?.user?.id]
            });
            toast({
                title: "Succès",
                description: "Disponibilité créée",
                variant: "default"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.message,
                variant: "destructive"
            });
        }
    });

    // Mettre à jour une disponibilité
    const updateAvailability = useMutation({
        mutationFn: async ({
                               id,
                               data
                           }: {
            id: string;
            data: AvailabilityInput;
        }) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const response = await client.patch(
                `/api/v1/practitioners/availability/${id}`,
                data
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["availability", session?.user?.id]
            });
            toast({
                title: "Succès",
                description: "Disponibilité mise à jour",
                variant: "default"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.message,
                variant: "destructive"
            });
        }
    });

    // Supprimer une disponibilité
    const deleteAvailability = useMutation({
        mutationFn: async (availabilityId: string) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            await client.delete(
                `/api/v1/practitioners/availability/${availabilityId}`
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["availability", session?.user?.id]
            });
            toast({
                title: "Succès",
                description: "Disponibilité supprimée",
                variant: "default"
            });
        }
    });

    // Créer une indisponibilité
    const createUnavailability = useMutation({
        mutationFn: async (input: UnavailabilityInput) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const { data } = await client.post(
                "/api/v1/practitioners/unavailability",
                {
                    start_date: input.startDate.toISOString(),
                    end_date: input.endDate.toISOString(),
                    reason: input.reason
                }
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["availability", session?.user?.id]
            });
            toast({
                title: "Succès",
                description: "Indisponibilité créée",
                variant: "default"
            });
        }
    });

    // Supprimer une indisponibilité
    const deleteUnavailability = useMutation({
        mutationFn: async (unavailabilityId: string) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            await client.delete(
                `/api/v1/practitioners/unavailability/${unavailabilityId}`
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["availability", session?.user?.id]
            });
            toast({
                title: "Succès",
                description: "Indisponibilité supprimée",
                variant: "default"
            });
        }
    });

    return {
        usePractitionerAvailability,
        createAvailability,
        updateAvailability,
        deleteAvailability,
        createUnavailability,
        deleteUnavailability
    };
}