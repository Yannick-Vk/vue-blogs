import {defineStore, storeToRefs} from "pinia";
import {api} from "@/services/Api.ts";
import {useUserStore} from "@/stores/userStore.ts";

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
            await api.put(`/me/change/password`, {
                newPassword: newPassword,
                password: password
            })
        } catch (error) {
            throw error;
        }
    }

    async function changeProfilePicture(image: File) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(image.type)) {
            throw new Error('Invalid image format. Please upload a JPG, PNG, GIF, or WEBP file.');
        }
        try {
            const formData = new FormData();
            formData.append('image', image);
            await api.put(`/me/change/profile-picture`,formData)
        } catch (error) {
            throw error;
        }
    }

    async function getProfilePicture() {
        try {
            const response = await api.get(`/me/profile-picture`, {
                responseType: 'blob'
            })
            return URL.createObjectURL(response.data);
        } catch (error) {
            const userStore = useUserStore();
            const {currentUser} = storeToRefs(userStore);
            return `https://i.pravatar.cc/64?u=${currentUser.value.username}`;
        }
    }

    return {changeEmail, changePassword, changeProfilePicture, getProfilePicture};
})