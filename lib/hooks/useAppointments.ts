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
                    `/api/v1