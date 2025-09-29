import {computed, ref} from 'vue'
import {defineStore} from 'pinia'
import axios, {type AxiosResponse} from 'axios'
import {api_base_url} from "@/services/Api.ts";

axios.defaults.withCredentials = true;

// Define a type for the user data you expect from your API
export class User {
    id: string;
    username: string;
    email: string;

    constructor(loginResponse: LoginResponse) {
        this.id = loginResponse.id;
        this.username = loginResponse.username;
        this.email = loginResponse.email;
    }
}

export interface LoginResponse {
    id: string;
    username: string;
    email: string;
    expiry: string;
}

const authApiUrl = `${api_base_url}/auth`;

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)

    // Load user from localStorage on store initialization
    const storedUser = localStorage.getItem('user');
    const expiration = localStorage.getItem('expiration');

    if (storedUser && expiration && new Date(expiration) > new Date()) {
        user.value = JSON.parse(storedUser);
    }

    // The user is authenticated if the user object is not null
    const isLoggedIn = computed(() => !!user.value)

    // Fetches the user's profile from a protected endpoint to check for an active session
    async function fetchUser() {
    }

    async function login(credentials: { username?: string, password?: string }) {
        try {
            // This endpoint sets the cookie and returns the user object
            const response = await axios.post<LoginResponse>(`${authApiUrl}/login`, credentials);
            await setLocalStorage(response);
            user.value = new User(response.data)
        } catch (error) {
            user.value = null;
            throw error
        }
    }

    async function register(details: {
        username?: string,
        email?: string,
        password?: string
    }) {
        try {
            const response = await axios.post(`${authApiUrl}/register`, details);
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('expiration', response.data.expiry);
            user.value = new User(response.data)
        } catch (error) {
            user.value = null;
            throw error
        }
    }

    async function logout() {
        try {
            await axios.post(`${authApiUrl}/logout`);
        } finally {
            user.value = null
            localStorage.removeItem('user');
            localStorage.removeItem('expiration');
        }
    }

    async function setLocalStorage(response: AxiosResponse) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('expiration', response.data.expiry);
    }

    return {user, isLoggedIn, login, logout, register, fetchUser, setLocalStorage}
})


