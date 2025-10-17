<script lang="ts" setup>
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {useAuthStore} from '@/stores/auth';
import {useRouter} from 'vue-router';
import {api, api_base_url, isAxiosError} from '@/services/Api.ts'
import {ref} from "vue";

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()
const errorBox = ref<string | null>(null)

const schema = z.object({
  username: z.string("Username/Email cannot be empty").trim().nonempty("Username/Email cannot be empty"),
  password: z.string("Password cannot be empty").trim().nonempty("Password cannot be empty"),
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
const providerUrl = `${api_base_url}/auth/external-login?provider=`;
const providers = [{
  label: 'Google',
  icon: 'logos:google-icon',
  onClick: async () => {
    window.location.href = `${providerUrl}Google`;
    toast.add({title: 'Google', icon: "logos:google-icon", description: 'Login with Google'})
  }
}, {
  label: 'GitHub',
  icon: 'lucide:github',
  onClick: () => {
    window.location.href = `${providerUrl}GitHub`;
    toast.add({title: 'GitHub', icon: "lucide:github", description: 'Login with GitHub'})
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
    let errorMessage = `Unexpected error occurred: ${error}`;
    console.error(error)
    if (isAxiosError(error) && error.response?.data) {
      errorMessage = error.response.data as string;
    } else {
      if (isAxiosError(error) && !error.response) {
        errorMessage = 'Server is unavailable. Please try again later.';
      }
    }

    toast.add({
      title: 'Login Failed',
      icon: "lucide:user-x",
      description: errorMessage,
      color: 'error'
    })
    errorBox.value = errorMessage;
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
          :fields="fields"
          :providers="providers"
          :schema="schema"
          icon="i-lucide-lock"
          title="Welcome back!"
          @submit="onSubmit"
      >
        <template #description>
          Don't have an account?
          <ULink class="text-primary font-medium" to="register">Register</ULink>
          .
        </template>
        <template #password-hint>
          <ULink class="text-primary font-medium" tabindex="-1" to="#">Forgot password?</ULink>
        </template>
        <template #validation>
          <UAlert v-if="errorBox" :title="errorBox" color="error" icon="i-lucide-info"/>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>