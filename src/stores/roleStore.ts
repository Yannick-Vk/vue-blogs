import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Role} from '@/types/Role';
import {api} from '@/services/Api';

export const useRoleStore = defineStore('role', () => {
    const roles = ref<Role[]>([]);

    async function fetchAllRoles() {
        try {
            const response = await api.get<Role[]>('/roles');
            roles.value = response.data;
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    }

    async function getUserRoles(username: string) {
        try {
            const response = await api.get<string[]>(`users/${username}/roles`);
            roles.value = response.data.map(roleName => ({id: roleName, name: roleName}));
        } catch (err) {
            console.error(err);
        }
    }

    async function removeRoleFromUser(username: string,  roleName: string) {
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

    return {
        roles,
        fetchAllRoles,
        getUserRoles,
        removeRoleFromUser,
    }
});