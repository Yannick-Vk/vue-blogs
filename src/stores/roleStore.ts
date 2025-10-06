import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Role} from '@/types/Role';
import {api} from '@/services/Api';
import type {User} from "@/stores/userStore.ts";

export const useRoleStore = defineStore('role', () => {
    const roles = ref<Role[]>([]);
    const users = ref<User[]>([]);

    async function fetchAllRoles() {
        try {
            const response = await api.get<Role[]>('/roles');
            roles.value = response.data.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    }

    async function getUserRoles(username: string) {
        try {
            const response = await api.get<string[]>(`users/${username}/roles`);
            roles.value = response.data.map(roleName => ({
                id: roleName,
                name: roleName
            })).sort((a, b) => a.name.localeCompare(b.name));
        } catch (err) {
            console.error(err);
        }
    }

    async function removeRoleFromUser(username: string, roleName: string) {
        try {
            await api.post(`roles/remove-from-user`, {
                username: username,
                roleName: roleName,
            });
            await getUserRoles(username);
        } catch (err) {
            console.error(err);
        }
    }

    async function addRoleToUser(username: string, roleName: string) {
        try {
            const json = {
                username: username,
                roleName: roleName,
            };
            await api.post(`roles/add-to-user`, json);
        } catch (err) {
            console.error(err);
        }
    }

    async function getUsersWithRole(roleName: string) {
        try {
            const response = await api.get<User[]>(`roles/${roleName}`);
            users.value = response.data;
            return response.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async function createRole(roleName: string) {
        await api.post(`roles/`, {
            roleName: roleName,
        });
    }

    async function removeRole(roleName: string) {
        await api.delete(`roles/`, {
            data: {
                roleName: roleName,
            }
        });
    }

    return {
        roles, users,
        fetchAllRoles,
        getUserRoles,
        removeRoleFromUser,
        addRoleToUser,
        getUsersWithRole,
        createRole,
        removeRole,
    }
});