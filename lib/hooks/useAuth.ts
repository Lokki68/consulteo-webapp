'use client'

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const logout = useCallback(async () => {
        await signOut({ redirect: false });
        router.push("/login");
    }, [router]);

    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";
    const user = session?.user;

    return {
        user,
        isAuthenticated,
        isLoading,
        logout,
        session,
        update
    };
}