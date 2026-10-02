import axios, {AxiosInstance} from "axios";
import {getSession} from "next-auth/react";

let apiClient: AxiosInstance

const createApiClient = async (token?: string) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

    const client = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
        }
    })

    client.interceptors.request.use(async(config) => {
        let authToken = token

        if (!authToken) {
            const session = await getSession()
            authToken = (session?.user as any)?.token
        }

        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`
        }

        return config
    })

    client.interceptors.response.use(
        response => response,
        async (error) => {
            if (error.response?.status === 401) {
                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                }
            }

            return Promise.reject(error)
        }
    )

    return client
}

export const getApiClient = async (token?: string) => {
    it (!apiClient) {
        apiClient = await createApiClient(token)
    }

    return apiClient
}

export default createApiClient