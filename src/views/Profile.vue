<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {onMounted, reactive, ref} from "vue";
import {useProfileStore} from "@/stores/profileStore.ts";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/userStore.ts";
import {isAxiosError} from "@/services/Api.ts";

const profileStore = useProfileStore();
const userStore = useUserStore();
const {currentUser} = storeToRefs(userStore);

const userId = ref<string | null>(null);

const schema = z.object({
  email: z.email('Email is required'),
  password: z.string("Password is required").min(8, "Password requires at least 8 tokens"),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await profileStore.changeEmail(event.data.email, event.data.password);
    await userStore.fetchUser(userId.value!);
    toast.add({
      title: 'Successfully changed email',
      description: `Email has been changed to ${event.data.email}`,
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
      title: `Failed to change email-address to ${event.data.email}`,
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
      <UCard variant="subtle" class="my-4">
        <h3 class="text-lg mb-3 text-primary">Change email</h3>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Email" name="email">
            <UInput v-model="state.email" type="email" placeholder="Please enter new email ..." class="w-96"/>
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput v-model="state.password" type="password" placeholder="Please enter password ..." class="w-96"/>
          </UFormField>

          <UButton type="submit">
            Change email
          </UButton>
        </UForm>
      </UCard>


    </div>

    <div v-else>
      <p>Loading user profile...</p>
    </div>
  </div>
</template>

<style scoped>

</style>