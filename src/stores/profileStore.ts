import {defineStore} from "pinia";
import {api} from "@/services/Api.ts";

export const useProfileStore = defineStore('profile', () => {
    async function changeEmail(newEmail: string) {
        try {
            await api.put(`/me/change/email`, {
                email: newEmail
            })
        } catch (error) {
            throw error;
        }
    }

    return {changeEmail}
})