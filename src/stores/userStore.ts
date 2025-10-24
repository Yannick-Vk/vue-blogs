import {defineStore} from "pinia";
import {ref} from "vue";
import {api} from "@/services/Api.ts";
import type {Role} from '@/types/Role.ts';
import {useRoleStore} from "@/stores/roleStore.ts";

export interface User {
    id: string;
    username: string;
    email: string;
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
            users.value = response.data.sort((a, b) => a.username.localeCompare(b.username));
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

    async function getRoles(userId: string) {
        error.value = null;
        try {
            const roleStore = useRoleStore();
            await roleStore.getUserRoles(userId);
            roles.value = roleStore.roles;
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again.";
        }
    }

    async function removeRole(role: string) {
        error.value = null;
        try {
            if (!currentUser.value) {
                throw new Error("User is not logged in!");
            }
            const roleStore = useRoleStore();
            await roleStore.removeRoleFromUser(currentUser.value.id, role);
            await getRoles(currentUser.value.username);
        } catch (err) {
            console.error(err);
            error.value = "Failed to remove role";
        }
    }

    async function addRole(role: string) {
        if (!currentUser.value) {
            throw new Error("User is not logged in!");
        }
        const roleStore = useRoleStore();
        await roleStore.addRoleToUser(currentUser.value.id, role);
        await getRoles(currentUser.value.id);
    }

    async function getUser() {
        const response = await api.get("/users/me");
        currentUser.value = response.data;
    }

    return {users, error, currentUser, roles, fetchUsers, fetchUser, getRoles, removeRole, addRole, getUser};
});