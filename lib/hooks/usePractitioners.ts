import { useQuery } from "@tanstack/react-query";
import { getApiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";

export interface PractitionerSearchFilters {
    query?: string;
    speciality?: string;
    city?: string;
    rating?: number;
    sortBy?: "rating" | "name" | "price";
    page?: number;
    perPage?: number;
}

export function usePractitioners() {
    const { data: session } = useSession();

    // Rechercher les praticiens
    const useSearchPractitioners = (filters: PractitionerSearchFilters) => {
        return useQuery({
            queryKey: ["practitioners", filters],
            queryFn: async () => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );

                const params = new URLSearchParams();
                if (filters.query) params.append("search", filters.query);
                if (filters.speciality) params.append("speciality", filters.speciality);
                if (filters.city) params.append("city", filters.city);
                if (filters.rating) params.append("min_rating", filters.rating.toString());
                if (filters.sortBy) params.append("sort_by", filters.sortBy);
                if (filters.page) params.append("page", filters.page.toString());
                if (filters.perPage) params.append("per_page", filters.perPage.toString());

                const { data } = await client.get(
                    `/api/v1/practitioners?${params.toString()}`
                );
                return data.data;
            },
            enabled: !!session?.user,
            staleTime: 30 * 60 * 1000, // 30 minutes
            refetchOnWindowFocus: false
        });
    };

    // Récupérer les détails d'un praticien
    const usePractitioner = (practitionerId: string) => {
        return useQuery({
            queryKey: ["practitioners", practitionerId],
            queryFn: async () => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );
                const { data } = await client.get(
                    `/api/v1/practitioners/${practitionerId}`
                );
                return data.data;
            },
            enabled: !!practitionerId && !!session?.user,
            staleTime: 30 * 60 * 1000
        });
    };

    // Récupérer les créneaux disponibles
    const useAvailableSlots = (
        practitionerId: string,
        startDate: Date,
        endDate: Date
    ) => {
        return useQuery({
            queryKey: ["practitioners", practitionerId, "available-slots", startDate, endDate],
            queryFn: async () => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );
                const { data } = await client.get(
                    `/api/v1/practitioners/${practitionerId}/available_slots`,
                    {
                        params: {
                            start_date: startDate.toISOString(),
                            end_date: endDate.toISOString()
                        }
                    }
                );
                return data.data;
            },
            enabled: !!practitionerId && !!session?.user,
            staleTime: 10 * 60 * 1000 // 10 minutes
        });
    };

    // Récupérer les avis d'un praticien
    const usePractitionerReviews = (
        practitionerId: string,
        page = 1,
        perPage = 10
    ) => {
        return useQuery({
            queryKey: ["practitioners", practitionerId, "reviews", page],
            queryFn: async () => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );
                const { data } = await client.get(
                    `/api/v1/practitioners/${practitionerId}/reviews`,
                    {
                        params: { page, per_page: perPage }
                    }
                );
                return data.data;
            },
            enabled: !!practitionerId && !!session?.user,
            staleTime: 30 * 60 * 1000
        });
    };

    // Récupérer les spécialités
    const useSpecialities = () => {
        return useQuery({
            queryKey: ["specialities"],
            queryFn: async () => {
                const client = await getApiClient(
                    (session?.user as any)?.token
                );
                const { data } = await client.get("/api/v1/specialities");
                return data.data;
            },
            enabled: !!session?.user,
            staleTime: 24 * 60 * 60 * 1000 // 24 heures
        });
    };

    return {
        useSearchPractitioners,
        usePractitioner,
        useAvailableSlots,
        usePractitionerReviews,
        useSpecialities
    };
}