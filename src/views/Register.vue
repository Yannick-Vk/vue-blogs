<script setup lang="ts">
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {reactive} from "vue";
import {useAuthStore} from '@/stores/auth';
import {useRouter} from 'vue-router';
import type {AxiosError} from 'axios';

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

const schema = z.object({
  username: z.string().trim().nonempty("Username cannot be empty"),
  email: z.email().trim().nonempty("Email cannot be empty"),
  password: z.string().trim().nonempty("Password cannot be empty"),
  password_confirmation: z.string().trim().nonempty("Password confirm cannot be empty"),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ["password_confirmation"],
});

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: "",
  email: "",
  password: "",
  password_confirmation: "",
})

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await authStore.register(event.data)
    toast.add({title: 'Registry Successful!', icon: "lucide:user-round-check", description: `Welcome ${authStore.user?.username}`, color: 'success'})
    await router.push({name: 'home'})
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      toast.add({title: 'Registry Failed', icon: "lucide:user-x", description: `Error: ${error.response.data}`, color: 'error'})
    } else {
      toast.add({title: 'Registry Failed', icon: "lucide:user-x", description: `An unexpected error occurred: ${error}`, color: 'error'})
    }
  }
}
</script>

<template>
  <div class="flex justify-center mt-5">
    <UCard variant="subtle">
      <template #header>
        <h2 class="text-2xl text-primary-800">Register</h2>
      </template>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Username" name="username">
          <UInput v-model="state.username" class="w-80"/>
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="state.email" class="w-80"/>
        </UFormField>

        <UFormField label="Password" name="password">
          <PasswordField v-model="state.password" class="w-80"></PasswordField>
        </UFormField>

        <UFormField label="Confirm Password" name="password_confirmation">
          <PasswordField v-model="state.password_confirmation" class="w-80"></PasswordField>
        </UFormField>

        <UButton type="submit">
          Submit
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center">
          Already have an account?
          <ULink to="/login" class="text-primary-500 hover:text-secondary-500">Login here
          </ULink>
        </p>
      </template>
    </UCard>
  </div>
</template>