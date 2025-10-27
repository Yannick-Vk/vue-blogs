<script setup lang="ts">
import * as z from 'zod'
import {reactive} from 'vue'
import type {FormSubmitEvent} from "@nuxt/ui";
import {useProfileStore} from "@/stores/profileStore.ts";
import {useRouter} from "vue-router";

const schema = z.object({
  email: z.email("Email must be a valid email-address").trim().nonempty("Username/Email cannot be empty"),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
})

const toast = useToast()
const profileStore = useProfileStore();
const router = useRouter();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await profileStore.resetPassword(event.data.email);
    toast.add({
      title: 'Password reset email sent',
      description: `The email has been sent to ${event.data.email}, please check your mail to confirm your password reset`,
      color: 'success',
      icon: 'lucide:mail-check',
    })
    await router.push('/home');
  } catch (e) {
    console.error(e);
    toast.add({title: "Failed to reset password", description: `Failed to reset password, ${e}`, color: "error"})
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl text-primary">Forgot password</h2>
      </template>
      <template #body>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Email" name="email">
            <UInput v-model="state.email" placeholder="Please enter your email address ..." class="w-96"/>
          </UFormField>

          <UButton type="submit">
            Reset password
          </UButton>
        </UForm>
      </template>
    </UPageCard>
  </div>
</template>

<style scoped>

</style>