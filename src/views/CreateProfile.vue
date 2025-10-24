<script lang="ts" setup>
import {onMounted} from "vue";
import {useProfileStore} from "@/stores/profileStore.ts";
import {useUserStore} from "@/stores/userStore.ts"
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useAuthStore} from "@/stores/auth.ts";

const toast = useToast();
const router = useRouter();
const userStore = useUserStore();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const {currentUser} = storeToRefs(userStore);

async function onChangeUsername(username: string) {
  try {
    await profileStore.changeUsername(username);
    await authStore.whoAmI();
    //await fetchAvatar();
    await userStore.getUser();

    toast.add({
      title: `Changed username to ${username}`,
      description: `Created profile with username ${username}`,
      color: "success",
      icon: "lucide:check",
    })
  } catch (e) {
    console.error(e)

  }
}

async function UploadImage(image: File) {
  try {
    await profileStore.changeProfilePicture(image);
    //await fetchAvatar();

    toast.add({
      title: 'Successfully changed profile image',
      description: `Profile picture has been updated.`,
      color: 'success'
    })

    changeProfilePictureForm.value?.reset();
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  await userStore.getUser();
})
</script>

<template>
  <h2 class="text-3xl text-primary">Welcome to JS-Blogger</h2>
  <p class="text-lg">Your account has been created, but may require some changes.</p>
  <div v-if="currentUser">
    <h3 class="mb-3">Your current username is
      <span class="font-bold text-primary">{{ currentUser?.username ?? "unknown" }}</span>
      , do you want to change it?
    </h3>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 my-5">
      <ChangeUsernameForm @submit="onChangeUsername"></ChangeUsernameForm>
      <UploadProfilePictureForm @submit="UploadImage" button></UploadProfilePictureForm>
    </div>
    <p>You can always change this later, want to finish the profile creation?</p>
    <UButton @click="async () => await router.push('home')" class="mt-5">Go to home page</UButton>
  </div>
  <div v-else>Loading user data...</div>
</template>
