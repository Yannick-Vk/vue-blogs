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
  username: z.string().trim().nonempty("Username/Email cannot be empty"),
  password: z.string().trim().nonempty("Password cannot be empty"),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: "",
  password: "",
})

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await authStore.login(event.data)
    toast.add({title: 'Login Successful!', icon: "lucide:user-round-check", description: `Welcome back ${authStore.user?.username}`, color: 'success'})
    await router.push({name: 'home'})
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      toast.add({title: 'Login Failed', icon: "lucide:user-x", description: `Error: ${error.response.data}`, color: 'error'})
    } else {
      toast.add({title: 'Login Failed', icon: "lucide:user-x", description: `An unexpected error occurred: ${error}`, color: 'error'})
    }
  }
}
</script>

<template>
  <div class="flex justify-center mt-5">
    <UCard variant="subtle">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Username/Email" name="username">
          <UInput v-model="state.username" class="w-80"/>
        </UFormField>

        <UFormField label="Password" name="password">
          <PasswordField v-model="state.password" class="w-80"></PasswordField>
        </UFormField>

        <UButton type="submit">
          Submit
        </UButton>
      </UForm>
      <p class="text-center mt-4">
        Don't have an account yet?
        <ULink to="/register" class="text-primary-500 hover:text-secondary-500">Register here
        </ULink>
      </p>
    </UCard>
  </div>
</template>