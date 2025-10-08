import {defineStore, storeToRefs} from "pinia";
import {api, isAxiosError} from "@/services/Api.ts";
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

    async function getProfilePicture(userId: string): Promise<string | null> {
        try {
            const response = await api.get(`/users/${userId}/profile-picture`, {
                responseType: 'blob',
                validateStatus: (status) => status < 500,
            });

            if (response.status === 404 || response.data.size === 0) {
                return null;
            }

            return URL.createObjectURL(response.data);
        } catch (error) {
            console.error(`Failed to get profile picture for user ${userId}`, error);
            return null;
        }
    }

    async function getMyProfilePicture(): Promise<string | null> {
        try {
            const response = await api.get(`/me/profile-picture`, {
                responseType: 'blob',
                validateStatus: (status) => status < 500,
            });

            if (response.status === 404 || response.data.size === 0) {
                return null;
            }

            return URL.createObjectURL(response.data);
        } catch (error) {
            console.error(`Failed to get profile picture for logged in user`, error);
            return null;
        }
    }

    return {changeEmail, changePassword, changeProfilePicture, getProfilePicture, getMyProfilePicture};
})