<script setup lang="ts">
import * as z from 'zod'
import {reactive, ref} from 'vue'
import type {FormSubmitEvent} from "@nuxt/ui";
import {useProfileStore} from "@/stores/profileStore.ts";
import {useRouter} from "vue-router";

const schema = z.object({
  password: z.string("Password cannot be empty").trim().min(8, "Password must contain at least 8 characters"),
  confirmPassword: z.string("Confirm Password cannot be empty").trim().min(8, "Confirm Password must contain at least 8 characters"),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  password: undefined,
})

const fields = [{
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

const errorBox = ref<string | null>(null);

const toast = useToast()
const profileStore = useProfileStore();
const router = useRouter();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    errorBox.value = null;
    await profileStore.confirmResetPassword("", "", event.data.password);
    toast.add({
      title: 'Password has been reset',
      description: 'Your password have been reset, please login to continue.',
      color: 'success',
      icon: 'lucide:check-circle',
    })
    await router.push('/login');
  } catch (e) {
    console.error(e);
    errorBox.value = e;
    toast.add({title: "Failed to reset password", description: `Failed to reset password, ${e}`, color: "error"})
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl text-primary">Reset password</h2>
      </template>
      <template #body>
        <UAuthForm :fields="fields" :schema="schema" class="space-y-4" @submit="onSubmit">

          <template #validation>
            <UAlert v-if="errorBox" :title="errorBox" color="error" icon="i-lucide-info"/>
          </template>

          <UButton type="submit">
            Reset password
          </UButton>
        </UAuthForm>
      </template>
    </UPageCard>
  </div>
</template>

<style scoped>

</style>