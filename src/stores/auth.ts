import {computed, ref} from 'vue'
import {defineStore} from 'pinia'
import axios, {type AxiosResponse} from 'axios'
import {api, api_base_url} from "@/services/Api.ts";
import {useUserStore} from "@/stores/userStore.ts";

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

export const useAuthStore = defineStore('auth', () => {
    const authApiUrl = `${api_base_url}/auth`;
    const user = ref<User | null>(null)
    const isAdmin = ref(false);
    let adminCheckPromise: Promise<boolean> | null = null;

    async function checkIsAdmin() {
        if (!user.value) {
            isAdmin.value = false;
            return isAdmin.value;
        }
        try {
            const response = await api.get('/roles/me/Admin');
            isAdmin.value = response.data;
        } catch (err) {
            console.warn("Error checking admin status, setting to false");
            isAdmin.value = false;
        }
        return isAdmin.value;
    }

    // Load user from localStorage on store initialization
    const storedUser = localStorage.getItem('user');
    const expiration = localStorage.getItem('expiration');

    if (storedUser && expiration && new Date(expiration) > new Date()) {
        user.value = JSON.parse(storedUser);
        adminCheckPromise = checkIsAdmin()
    }

    // The user is authenticated if the user object is not null
    const isLoggedIn = computed(() => !!user.value)

    // Fetches the user's profile from a protected endpoint to check for an active session
    async function fetchUser() {
        try {
            const response = await api.get<LoginResponse>(`${authApiUrl}/whoAmI`);
            handleLoginResponse(response);
        } catch (error) {
            console.error("Failed to fetch user session:", error);
            await logout(); // Log out if session is invalid
        }
    }

    // Helper function to centralize login/registration logic
    function handleLoginResponse(response: AxiosResponse<LoginResponse>) {
        const userData = response.data;
        user.value = new User(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('expiration', userData.expiry);
        adminCheckPromise = checkIsAdmin();
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
            const userStore = useUserStore();
            userStore.currentUser = null;
        } finally {
            user.value = null
            isAdmin.value = false;
            localStorage.removeItem('user');
            localStorage.removeItem('expiration');
        }
    }

    async function refresh(response: AxiosResponse) {
        handleLoginResponse(response);
    }

    async function whoAmI() {
        try {
            const login = await axios.get<LoginResponse>(`${authApiUrl}/whoAmI`);
            handleLoginResponse(login);
        } catch (e) {
            console.error("WhoAmI failed:" + e);
        }
    }

    function getAdminCheckPromise() {
        return adminCheckPromise;
    }

    return {user, isLoggedIn, login, logout, register, fetchUser, refresh, whoAmI, isAdmin, getAdminCheckPromise, checkIsAdmin};
})


