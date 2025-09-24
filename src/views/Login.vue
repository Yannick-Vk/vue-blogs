<script setup lang="ts">
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {useAuthStore} from '@/stores/auth';
import {useRouter} from 'vue-router';
import type {AxiosError} from 'axios';

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

const schema = z.object({
  username: z.string("Username/Email cannot be empty").trim().nonempty("Username/Email cannot be empty"),
  password: z.string("Username/Email cannot be empty").trim().nonempty("Password cannot be empty"),
})

type Schema = z.output<typeof schema>

const fields = [{
  name: 'username',
  type: 'text' as const,
  label: 'Username/Email',
  placeholder: 'Enter your username or email',
  required: true,
}, {
  name: 'password',
  label: 'Password',
  type: 'password' as const,
  placeholder: 'Enter your password',
  required: true,
}]

const providers = [{
  label: 'Google',
  icon: 'logos:google-icon',
  onClick: () => {
    toast.add({ title: 'Google', icon: "logos:google-icon", description: 'Login with Google' })
  }
}, {
  label: 'GitHub',
  icon: 'lucide:github',
  onClick: () => {
    toast.add({ title: 'GitHub', icon:"lucide:github", description: 'Login with GitHub' })
  }
}]

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await authStore.login(event.data)
    toast.add({
      title: 'Login Successful!',
      icon: "lucide:user-round-check",
      description: `Welcome back ${authStore.user?.username}`,
      color: 'success'
    })
    await router.push({name: 'home'})
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      toast.add({
        title: 'Login Failed',
        icon: "lucide:user-x",
        description: `Error: ${error.response.data}`,
        color: 'error'
      })
    } else {
      toast.add({
        title: 'Login Failed',
        icon: "lucide:user-x",
        description: `An unexpected error occurred: ${error}`,
        color: 'error'
      })
    }
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
          :schema="schema"
          :fields="fields"
          :providers="providers"
          title="Welcome back!"
          icon="i-lucide-lock"
          @submit="onSubmit"
      >
        <template #description>
          Don't have an account? <ULink to="register" class="text-primary font-medium">Register</ULink>.
        </template>
        <template #password-hint>
          <ULink to="#" class="text-primary font-medium" tabindex="-1">Forgot password?</ULink>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>