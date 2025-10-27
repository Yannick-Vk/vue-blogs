<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useProfileStore} from "@/stores/profileStore.ts";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/userStore.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {isAxiosError} from "@/services/Api.ts";
import ChangeEmailForm from "@/components/ChangeEmailForm.vue";
import ChangePasswordForm from "@/components/ChangePasswordForm.vue";
import UploadProfilePictureForm from "@/components/UploadProfilePictureForm.vue";
import ChangeUsernameForm from "@/components/ChangeUsernameForm.vue";

const profileStore = useProfileStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const {currentUser} = storeToRefs(userStore);

const toast = useToast()
const changeEmailForm = ref<{ reset: () => void } | null>(null)

async function changeEmail(email: string) {
  try {
    await profileStore.changeEmail(email);
    await userStore.getUser();

    toast.add({
      title: 'Successfully changed email',
      description: `Email has been changed to ${email}`,
      color: 'success'
    })

    changeEmailForm.value?.reset();
  } catch (e) {
    console.error(e)
    let errorMessage = `Unexpected error occurred: ${e}`;
    if (isAxiosError(e) && e.response?.data) {
      errorMessage = (e.response.data as any).detail;
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

const changeUsernameForm = ref<{ reset: () => void, setError: (msg: string) => void} | null>(null)

async function changeUsername(username: string) {
  try {
    await profileStore.changeUsername(username);
    await authStore.whoAmI();
    await fetchAvatar();
    await userStore.getUser();

    toast.add({
      title: 'Successfully changed username',
      description: `Username has been changed to ${username}`,
      color: 'success'
    })
    changeUsernameForm.value?.reset();
  } catch (e) {
    let errorMessage = `Unexpected error occurred: ${e}`;
    console.error(errorMessage)
    if (isAxiosError(e) && e.response?.data) {
      errorMessage = (e.response.data as any).detail;
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }

    changeUsernameForm.value?.setError(errorMessage);

    toast.add({
      title: `Failed to change username to ${username}`,
      description: errorMessage,
      color: 'error'
    })
  }
}

const changePasswordFrom = ref<{ setError: (message: string) => void } | null>(null)
async function changePassword(newPassword: string, password: string) {
  try {
    await profileStore.changePassword(newPassword, password);
    await userStore.getUser();

    toast.add({
      title: 'Successfully changed password',
      description: `Password has been changed.`,
      color: 'success'
    })
  } catch (e) {
    console.error(e)
    let errorMessage = `Unexpected error occurred: ${e}`;
    if (isAxiosError(e) && e.response?.data) {
      errorMessage =  e.response.data as string;
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }

    changePasswordFrom.value?.setError(errorMessage);

    toast.add({
      title: `Failed to change password`,
      description: errorMessage,
      color: 'error'
    })
  }
}

const changeProfilePictureForm = ref<{ reset: () => void } | null>(null)
const avatar = ref<string>('');

async function fetchAvatar() {
  if (currentUser.value) {
    const image = await profileStore.getProfilePicture(currentUser.value.id);
    avatar.value = image || `https://i.pravatar.cc/64?u=${currentUser.value.username}`;
  }
}

async function changeProfilePicture(image: File) {
  try {
    await profileStore.changeProfilePicture(image);
    await fetchAvatar();

    toast.add({
      title: 'Successfully changed profile image',
      description: `Profile picture has been updated.`,
      color: 'success'
    })

    changeProfilePictureForm.value?.reset();
  } catch (e) {
    console.error(e)
    let errorMessage = `Unexpected error occurred: ${e}`;
    if (isAxiosError(e) && e.response?.data) {
      errorMessage = e.response.data as string;
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }

    toast.add({
      title: `Failed to change profile picture`,
      description: errorMessage,
      color: 'error'
    })
    // Reset if the file was a wrong format
    changeProfilePictureForm.value?.reset();
  }

}

onMounted(async () => {
  await userStore.getUser();
  await fetchAvatar();
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Profile</h2>
    <div v-if="currentUser">
      <UUser
          :avatar="{
          src: avatar,
          alt: currentUser.username,
        }"
          :description="currentUser.email"
          :name="currentUser.username"
          size="3xl"
      />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <ChangeEmailForm ref="changeEmailForm" @submit="changeEmail"/>
        <ChangeUsernameForm ref="changeUsernameForm" @submit="changeUsername"/>
        <ChangePasswordForm ref="changePasswordFrom" @submit="changePassword"/>
        <UploadProfilePictureForm ref="changeProfilePictureForm" @submit="changeProfilePicture"/>
      </div>

    </div>

    <div v-else>
      <p>Loading user profile...</p>
    </div>
  </div>
</template>