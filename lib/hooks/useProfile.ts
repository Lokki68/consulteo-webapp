import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import type {
    PatientProfileInput,
    PractitionerProfileInput
} from "@/lib/security/validators";

export function useProfile() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Récupérer le profil utilisateur
    const useUserProfile = () => {
        return useQuery({
            queryKey: ["profile", session?.user?.id],
            queryFn: async () => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );

                const endpoint = session?.user?.role === "practitioner"
                    ? "/api/v1/practitioners/profile"
                    : "/api/v1/patients/profile";

                const { data } = await client.get(endpoint);
                return data.data;
            },
            enabled: !!session?.user,
            staleTime: 30 * 60 * 1000 // 30 minutes
        });
    };

    // Mettre à jour le profil patient
    const updatePatientProfile = useMutation({
        mutationFn: async (input: PatientProfileInput) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const { data } = await client.patch(
                "/api/v1/patients/profile",
                input
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast({
                title: "Succès",
                description: "Profil mis à jour avec succès",
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

    // Mettre à jour le profil praticien
    const updatePractitionerProfile = useMutation({
        mutationFn: async (input: PractitionerProfileInput) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const { data } = await client.patch(
                "/api/v1/practitioners/profile",
                input
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast({
                title: "Succès",
                description: "Profil mis à jour avec succès",
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

    // Uploader l'avatar
    const uploadAvatar = useMutation({
        mutationFn: async (file: File) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );

            const formData = new FormData();
            formData.append("avatar", file);

            const endpoint = session?.user?.role === "practitioner"
                ? "/api/v1/practitioners/avatar"
                : "/api/v1/patients/avatar";

            const { data } = await client.post(endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast({
                title: "Succès",
                description: "Avatar mis à jour",
                variant: "default"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Erreur lors du upload",
                variant: "destructive"
            });
        }
    });

    // Changer le mot de passe
    const changePassword = useMutation({
        mutationFn: async ({
                               currentPassword,
                               newPassword
                           }: {
            currentPassword: string;
            newPassword: string;
        }) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            const { data } = await client.patch(
                "/api/v1/users/change-password",
                {
                    current_password: currentPassword,
                    new_password: newPassword
                }
            );
            return data.data;
        },
        onSuccess: () => {
            toast({
                title: "Succès",
                description: "Mot de passe changé avec succès",
                variant: "default"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Erreur lors du changement",
                variant: "destructive"
            });
        }
    });

    // Supprimer le compte
    const deleteAccount = useMutation({
        mutationFn: async (password: string) => {
            const client = await getApiClient(
                (session?.user as any)?.token
            );
            await client.delete("/api/v1/users/account", {
                data: { password }
            });
        },
        onSuccess: () => {
            queryClient.clear();
            toast({
                title: "Succès",
                description: "Compte supprimé",
                variant: "default"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Erreur lors de la suppression",
                variant: "destructive"
            });
        }
    });

    return {
        useUserProfile,
        updatePatientProfile,
        updatePractitionerProfile,
        uploadAvatar,
        changePassword,
        deleteAccount
    };
}