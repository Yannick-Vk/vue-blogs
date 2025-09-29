import axios, {type AxiosError} from "axios";
import {useAuthStore} from "@/stores/auth.ts";

export const api_base_url = "https://localhost:7134/api/v1";

export const api = axios.create({
    baseURL: api_base_url,
    withCredentials: true
});

// Intercept a 401 response to refresh the token
// On 2** responses continues
api.interceptors.response.use(response => response, async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // Check for a 401 and it's not a retry
    if (error.response.status === 401 && !originalRequest._retry) {
        // Set the retry prop
        originalRequest._retry = true;

        try {
            await api.post('/auth/refresh');
            return api(originalRequest);
        } catch (err) {
            console.error("Unable to refresh token, Logging out", err);
            await authStore.logout();
            return Promise.reject(err);
        }
    }

    // Non 401 requests
    return Promise.reject(error);

})

export function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
}