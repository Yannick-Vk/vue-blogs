import {computed, ref} from 'vue'
import {defineStore} from 'pinia'
import axios, {type AxiosResponse} from 'axios'
import {api, api_base_url} from "@/services/Api.ts";

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

    // Helper function to centralize login/registration logic
    function handleLoginResponse(response: AxiosResponse<LoginResponse>) {
        const userData = response.data;
        user.value = new User(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('expiration', userData.expiry);
    }

    async function login(credentials: { username?: string, password?: string }) {
        try {
            const response = await axios.post<LoginResponse>(`${authApiUrl}/login`, credentials);
            handleLoginResponse(response);
        } catch (error) {
            user.value = null;
            throw error
        }
    }

    async function register(details: {
        username?: string, email?: string, password?: string
    }) {
        try {
            const response = await axios.post<LoginResponse>(`${authApiUrl}/register`, details);
            handleLoginResponse(response);
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

    async function refresh(response: AxiosResponse) {
        await handleLoginResponse(response);
    }

    const isAdmin = computed(async () => {
        try {
            const response = await api.get('/roles/me/Admin')
            console.dir('Is user Admin?', response.data)
            return response.data;
        } catch (err) {
            return false;
        }
    });

    return {user, isLoggedIn, login, logout, register, fetchUser, refresh, isAdmin};
})


