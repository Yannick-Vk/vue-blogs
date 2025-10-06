<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import {onMounted, ref} from "vue";
import {useProfileStore} from "@/stores/profileStore.ts";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/userStore.ts";
import {isAxiosError} from "@/services/Api.ts";
import ChangeEmailForm from "@/components/ChangeEmailForm.vue";
import ChangePasswordForm from "@/components/ChangePasswordForm.vue";

const profileStore = useProfileStore();
const userStore = useUserStore();
const {currentUser} = storeToRefs(userStore);

const userId = ref<string | null>(null);

const toast = useToast()

async function changeEmail(email: string, password: string) {
  try {
    await profileStore.changeEmail(email, password);
    await userStore.fetchUser(userId.value!);
    toast.add({
      title: 'Successfully changed email',
      description: `Email has been changed to ${email}`,
      color: 'success'
    })
  } catch (e) {
    console.error(e)
    let errorMessage = `Unexpected error occurred: ${e}`;
    if (isAxiosError(e) && e.response?.data) {
      errorMessage = e.response.data as string;
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }

    toast.add({
      title: `Failed to change email-address to ${email}`,
      description: errorMessage,
      color: 'error'
    })
  }
}

async function changePassword(newPassword: string, password: string) {
  try {
    await profileStore.changePassword(newPassword, password);
    await userStore.fetchUser(userId.value!);
    toast.add({
      title: 'Successfully changed password',
      description: `Password has been changed.`,
      color: 'success'
    })
  } catch (e) {
    console.error(e)
    let errorMessage = `Unexpected error occurred: ${e}`;
    if (isAxiosError(e) && e.response?.data) {
      errorMessage = e.response.data as string;
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }

    toast.add({
      title: `Failed to change password`,
      description: errorMessage,
      color: 'error'
    })
  }
}

onMounted(async () => {
  const authStore = useAuthStore();
  const user = authStore.user;
  await userStore.fetchUser(user!.id);
  userId.value = user!.id;
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Profile</h2>
    <div v-if="currentUser">
      <UUser
          :name="currentUser.username"
          :description="currentUser.email"
          :avatar="{
          src: `https://i.pravatar.cc/64?u=${currentUser.username}`,
        }"
          size="3xl"
      />
      <div class="flex flex-row gap-5 justify-between">
        <ChangeEmailForm @submit="changeEmail"/>
        <ChangePasswordForm @submit="changePassword"/>
      </div>

    </div>

    <div v-else>
      <p>Loading user profile...</p>
    </div>
  </div>
</template>