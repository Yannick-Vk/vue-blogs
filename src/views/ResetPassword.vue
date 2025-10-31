<script setup lang="ts">
import * as z from 'zod'
import {reactive, ref} from 'vue'
import type {FormSubmitEvent} from "@nuxt/ui";
import {useProfileStore} from "@/stores/profileStore.ts";
import {useRoute, useRouter} from "vue-router";

const schema = z.object({
  password: z.string("Password cannot be empty").trim().min(8, "Password must contain at least 8 characters"),
  confirmPassword: z.string("Confirm Password cannot be empty").trim().min(8, "Confirm Password must contain at least 8 characters"),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  password: undefined,
  confirmPassword: undefined,
})

const errorBox = ref<Array<{
  description: string
}>>([]);

const toast = useToast()
const profileStore = useProfileStore();
const router = useRouter();
const route = useRoute();
const userId = route.params.id as string;
const token = route.params.token as string;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    errorBox.value = [];
    const password = event.data.password;
    const confirm = event.data.confirmPassword;

    if (password !== confirm) {
      const errorMessage = 'Passwords do not match';
      toast.add({
        title: 'Registration Failed',
        icon: "lucide:user-x",
        description: errorMessage,
        color: 'error'
      })
      errorBox.value = [{description: errorMessage}];
      return;
    }

    await profileStore.confirmResetPassword(userId, token, event.data.password);
    toast.add({
      title: 'Password has been reset',
      description: 'Your password have been reset, please login to continue.',
      color: 'success',
      icon: 'lucide:check-circle',
    })
    await router.push('/login');
  } catch (e: any) {
    console.error(e);
    errorBox.value = e.response.data as { description: string }[];
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
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">

          <UFormField label="Password" name="password">
            <PasswordField v-model="state.password" class="block w-full" placeholder="Password..."/>
          </UFormField>
          <UFormField label="Confirm Password" name="confirmPassword">
            <PasswordField v-model="state.confirmPassword" class="block w-full" placeholder="Confirm password..."/>
          </UFormField>

          <div v-if="errorBox.length > 0">
            <UAlert color="error" variant="subtle" class="my-5">
              <template #title>
                <h3 class="text-2xl">Failed to change password</h3>
              </template>
              <template #description>
                <ul v-for="error in errorBox">
                  <li class="list-disc ml-5">{{ error.description }}</li>
                </ul>
              </template>
            </UAlert>
          </div>

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