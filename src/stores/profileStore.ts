import {defineStore} from "pinia";
import {api} from "@/services/Api.ts";
import {ref} from "vue";

export const useProfileStore = defineStore('profile', () => {
    const avatarCache = ref(new Map<string, string | null>());

    async function changeEmail(newEmail: string,) {
        try {
            await api.put(`/me/change/email`, {
                email: newEmail,
            })
        } catch (error) {
            throw error;
        }
    }

    async function changeUsername(newUsername: string,) {
        try {
            await api.put(`/me/change/username`, {
                username: newUsername,
            })
        } catch (error) {
            throw error;
        }
    }

    async function changePassword(password: string, newPassword: string,) {
        try {
            await api.put(`/me/change/password`, {
                newPassword: newPassword,
                password: password,
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
            await api.put(`/me/change/profile-picture`, formData)

            const {useAuthStore} = await import("@/stores/auth.ts");
            const authStore = useAuthStore();
            if (authStore.user) {
                avatarCache.value.delete(authStore.user.id);
            }
        } catch (error) {
            throw error;
        }
    }

    async function getProfilePicture(userId: string): Promise<string | null> {
        if (avatarCache.value.has(userId)) {
            return avatarCache.value.get(userId)!;
        }
        try {
            const response = await api.get(`/users/${userId}/profile-picture`, {
                responseType: 'blob',
                validateStatus: (status) => status < 500,
            });

            if (response.status === 404 || response.data.size === 0) {
                avatarCache.value.set(userId, null);
                return null;
            }

            const imageUrl = URL.createObjectURL(response.data);
            avatarCache.value.set(userId, imageUrl);
            return imageUrl;
        } catch (error) {
            console.error(`Failed to get profile picture for user ${userId}`, error);
            return null;
        }
    }

    async function getMyProfilePicture(): Promise<string | null> {
        const {useAuthStore} = await import("@/stores/auth.ts");
        const authStore = useAuthStore();
        const userId = authStore.user?.id;

        if (!userId) {
            console.error("User not logged in, cannot fetch profile picture.");
            return null;
        }

        if (avatarCache.value.has(userId)) {
            return avatarCache.value.get(userId)!;
        }

        try {
            const response = await api.get(`/me/profile-picture`, {
                responseType: 'blob',
                validateStatus: (status) => status < 500,
            });

            if (response.status === 404 || response.data.size === 0) {
                avatarCache.value.set(userId, null);
                return null;
            }

            const imageUrl = URL.createObjectURL(response.data);
            avatarCache.value.set(userId, imageUrl);
            return imageUrl;
        } catch (error) {
            console.error(`Failed to get profile picture for logged in user`, error);
            return null;
        }
    }

    return {changeEmail, changePassword, changeProfilePicture, getProfilePicture, getMyProfilePicture, changeUsername};
})