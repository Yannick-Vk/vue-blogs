<script setup lang="ts">
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {reactive, ref} from "vue";
import {useAuthStore} from '@/stores/auth';
import {useRouter} from 'vue-router';
import type {AxiosError} from 'axios';

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

const schema = z.object({
  username: z.string("Username cannot be empty").trim().nonempty("Username cannot be empty"),
  email: z.email("Email must be a valid email-address").trim().nonempty("Email cannot be empty"),
  password: z.string("Password cannot be empty").trim().nonempty("Password cannot be empty"),
  password_confirmation: z.string("Confirm password cannot be empty").trim().nonempty("Password confirm cannot be empty"),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ["password_confirmation"],
});

type Schema = z.output<typeof schema>

const providers = [{
  label: 'Google',
  icon: 'logos:google-icon',
  onClick: () => {
    toast.add({title: 'Google', icon: "logos:google-icon", description: 'Login with Google'})
  }
}, {
  label: 'GitHub',
  icon: 'lucide:github',
  onClick: () => {
    toast.add({title: 'GitHub', icon: "lucide:github", description: 'Login with GitHub'})
  }
}]

const fields = [{
  name: 'username',
  type: 'text' as const,
  label: 'Username',
  placeholder: 'Enter your username',
  required: true,
}, {
  name: 'email',
  type: 'text' as const,
  label: 'Email',
  placeholder: 'Enter your email',
  required: true,
}, {
  name: 'password',
  label: 'Password',
  type: 'password' as const,
  placeholder: 'Enter your password',
  required: true,
}, {
  name: 'password_confirmation',
  label: 'Password confirmation',
  type: 'password' as const,
  placeholder: 'Enter your password again',
  required: true,
}]

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

const errorBox = ref<string | null>(null);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await authStore.register(event.data)
    toast.add({
      title: 'Registration Successful!',
      icon: "lucide:user-round-check",
      description: `Welcome ${authStore.user?.username}`,
      color: 'success'
    })
    await router.push({name: 'home'})
  } catch (error) {
    let errorMessage = `Unexpected error occurred: ${error}`;
    if (isAxiosError(error) && error.response?.data) {
      errorMessage = error.response.data as string;
    } else {
      if (isAxiosError(error) && !error.response) {
        errorMessage = 'Server is unavailable. Please try again later.';
      }
    }

    toast.add({
      title: 'Registration Failed',
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
          :schema="schema"
          :fields="fields"
          :providers="providers"
          title="Welcome back!"
          icon="i-lucide-lock"
          @submit="onSubmit"
      >
        <template #description>
          Already have an account?
          <ULink to="login" class="text-primary font-medium">Login</ULink>
          .
        </template>
        <template #validation>
          <UAlert v-if="errorBox" color="error" icon="i-lucide-info" :title="errorBox"/>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>