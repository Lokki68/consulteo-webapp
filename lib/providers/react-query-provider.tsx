'use client'

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode} from "react";

let client: QueryClient | undefined

function getQueryClient() {
    if (!client) {
        client = new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                    gcTime: 5 * 60 * 1000,
                    retry: 1,
                    refetchOnWindowFocus: false,
                },
                mutations : {
                    retry: 1
                }
            }
        })
    }
    return client
}

export function ReactQueryProvider({ children }: { children: ReactNode}) {
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}