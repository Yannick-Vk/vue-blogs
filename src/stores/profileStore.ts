import {defineStore} from "pinia";
import {api} from "@/services/Api.ts";

export const useProfileStore = defineStore('profile', () => {
    async function changeEmail(newEmail: string, password: string) {
        try {
            await api.put(`/me/change/email`, {
                email: newEmail,
                password: password
            })
        } catch (error) {
            throw error;
        }
    }

    async function changePassword(newPassword: string, password: string) {
        try {
            console.log("Trying to change password");
            await api.put(`/me/change/password`, {
                newPassword: newPassword,
                password: password
            })
        } catch (error) {
            throw error;
        }
    }

    return {changeEmail, changePassword};
})