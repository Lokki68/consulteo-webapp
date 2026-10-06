import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";

export function useAppointments() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    // Récupérer les rendez-vous de l'utilisateur
    const useUserAppointments = (roleSpecific = false) => {
        return useQuery({
            queryKey: ["appointments", { role: session?.user?.role }],
            queryFn: async () => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );
                const endpoint = roleSpecific
                    ? `/api/v1/${session?.user?.role === "practitioner" ? "practitioners" : "patients"}/appointments`
                    : "/api/v1/appointments";
                const { data } = await client.get(endpoint);
                return data.data;
            },
            enabled: !!session?.user
        });
    };

    // Récupérer un rendez-vous spécifique
    const useAppointment = (appointmentId: string) => {
        return useQuery({
            queryKey: ["appointments", appointmentId],
            queryFn: async () => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );
                const { data } = await client.get(
                    `/api/v1/appointments/${appointmentId}`,
                )
                return data.data
            },
            enabled: !!appointmentId && !!session?.user,
            staleTime: 5 * 60 * 1000
        })
    }

    // Créer un rendez-vous
    const createAppointment = useMutation({
        mutationFn: async (input: AppointmentInput) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const { data } = await client.post("/api/v1/appointments", input);
            return data.data;
        },
        onSuccess: (newAppointment) => {
            addAppointment(newAppointment);
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            toast({
                title: "Succès",
                description: "Rendez-vous créé avec succès",
                variant: "default"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Erreur lors de la création",
                variant: "destructive"
            });
        }
    });

    const updateAppointmentMutation = useMutation({
        mutationFn: async ({
                               id,
                               data
                           }: {
            id: string;
            data: AppointmentUpdateInput;
        }) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const response = await client.patch(
                `/api/v1/appointments/${id}`,
                data
            );
            return response.data.data;
        },
        onSuccess: (updatedAppointment, variables) => {
            updateAppointment(variables.id, updatedAppointment);
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            toast({
                title: "Succès",
                description: "Rendez-vous mis à jour",
                variant: "default"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Erreur lors de la mise à jour",
                variant: "destructive"
            });
        }
    });

    const cancelAppointment = useMutation({
        mutationFn: async (input: AppointmentCancelInput) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const { data } = await client.post(
                `/api/v1/appointments/${input.appointmentId}/cancel`,
                { reason: input.reason }
            );
            return data.data;
        },
        onSuccess: (_, variables) => {
            deleteAppointment(variables.appointmentId);
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            toast({
                title: "Succès",
                description: "Rendez-vous annulé",
                variant: "default"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Erreur lors de l'annulation",
                variant: "destructive"
            });
        }
    });

    const rescheduleAppointment = useMutation({
        mutationFn: async ({
                               appointmentId,
                               newDate,
                               newTime
                           }: {
            appointmentId: string;
            newDate: Date;
            newTime: string;
        }) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const { data } = await client.patch(
                `/api/v1/appointments/${appointmentId}/reschedule`,
                { scheduled_at: new Date(`${newDate} ${newTime}`).toISOString() }
            );
            return data.data;
        },
        onSuccess: (_, variables) => {
            updateAppointment(variables.appointmentId, { scheduledAt: new Date() });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            toast({
                title: "Succès",
                description: "Rendez-vous reprogrammé",
                variant: "default"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Erreur lors de la reprogrammation",
                variant: "destructive"
            });
        }
    });

    return {
        useUserAppointments,
        useAppointment,
        createAppointment,
        updateAppointmentMutation,
        cancelAppointment,
        rescheduleAppointment
    };
}