import {User} from "@/lib/types/users.ts";

export interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean
    setUser: (user: User) => void
    setToken: (token: string) => void
    logout: () => void
}