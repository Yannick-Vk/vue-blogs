import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {api_base_url} from "@/services/Api.ts";

export interface User {
    id: string;
    username: string;
    email: string;
}

const api = `${api_base_url}/users`;

export const useUserStore = defineStore('users', () => {
    const users = ref<Array<User>>([])
    const currentUser = ref<User | null>(null)
    const error = ref<string | null>(null);

    async function fetchUsers() {
        error.value = null;
        try {
            const response = await axios.get<Array<User>>(`${api}`, {withCredentials: true});
            users.value = response.data;
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again later.";
        }
    }

    async function fetchUser(id: string) {
        error.value = null;
        try {
            const response = await axios.get<User>(`${api}/${id}`, {withCredentials: true});
            currentUser.value = response.data;
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again later.";
        }
    }

    return {users, error, currentUser, fetchUsers, fetchUser};
});