import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Role} from '@/types/Role';
import Api, {api} from '@/services/Api';

export const useRoleStore = defineStore('role', () => {
    const roles = ref<Role[]>([]);

    export async function fetchAllRoles() {
        try {
            const response = await Api.get<Role[]>('/roles'); // Assuming a '/roles' endpoint
            roles.value = response.data;
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    }

    export async function getRoles(username: string) {
        try {
            const response = await api.get<Array<string>>(`users/${username}/roles`);
            roles.value = response.data.map(role => ({name: role}));
        } catch (err) {
            console.error(err);
        }
    }
});
