import {computed, ref} from 'vue'
import {defineStore} from 'pinia'
import axios from 'axios'
import {api_base_url} from "@/services/Api.ts";

// Define a type for the user data you expect from your API
export interface User {
    id: number;
    username: string;
    email: string;
}

const authApiUrl = `${api_base_url}/auth`;

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)

    // The user is authenticated if the user object is not null
    const isLoggedIn = computed(() => !!user.value)

    // Fetches the user's profile from a protected endpoint to check for an active session
    async function fetchUser() {
    }

    async function login(credentials: { username?: string, password?: string }) {
        try {
            // This endpoint sets the cookie and returns the user object
            const response = await axios.post<User>(`${authApiUrl}/login`, credentials);
            console.log("Got user", response.data);
            user.value = response.data; // Set the user state directly from the login response
        } catch (error) {
            user.value = null;
            throw error
        }
    }

    async function register(details: {
        username?: string,
        email?: string,
        password?: string,
        password_confirmation?: string
    }) {

    }

    async function logout() {
        try {
            await axios.post(`${authApiUrl}/logout`);
        } finally {
            user.value = null
        }
    }

    return {user, isLoggedIn, login, logout, register, fetchUser}
})


