import {defineStore} from "pinia";
import {ref} from "vue";
import {api} from "@/services/Api.ts";

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface Role {
    name: string;
}

export const useUserStore = defineStore('users', () => {
    const users = ref<Array<User>>([])
    const currentUser = ref<User | null>(null)
    const error = ref<string | null>(null);
    const roles = ref<Array<Role>>([]);

    async function fetchUsers() {
        error.value = null;
        try {
            const response = await api.get<Array<User>>('users/', {withCredentials: true});
            users.value = response.data;
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again later.";
        }
    }

    async function fetchUser(id: string) {
        error.value = null;
        try {
            const response = await api.get<User>(`users/${id}`, {withCredentials: true});
            currentUser.value = response.data;
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again later.";
        }
    }

    async function getRoles(id: string) {
        error.value = null;
        try {
            const response = await api.get<Array<string>>(`users/${id}/roles`);
            roles.value = response.data.map(role => ({name: role}));
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again.";
        }
    }

    return {users, error, currentUser, roles, fetchUsers, fetchUser, getRoles};
});