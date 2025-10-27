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
})

const errorBox = ref<string | null>(null);

const toast = useToast()
const profileStore = useProfileStore();
const router = useRouter();
const route = useRoute();
const userId = route.path.id as string;
const token = route.query.token as string;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    errorBox.value = null;
    //await profileStore.confirmResetPassword(userId, token, event.data.password);
    console.log("userId", userId)
    console.log("token", token)
    toast.add({
      title: 'Password has been reset',
      description: 'Your password have been reset, please login to continue.',
      color: 'success',
      icon: 'lucide:check-circle',
    })
    //await router.push('/login');
  } catch (e) {
    console.error(e);
    errorBox.value = e;
    toast.add({title: "Failed to reset password", description: `Failed to reset password, ${e}`, color: "error"})
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <div>
      {{ token }} , {{ userId }}
    </div>
    <UPageCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl text-primary">Reset password</h2>
      </template>
      <template #body>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">

          <UFormField label="Password" name="newPassword">
            <PasswordField v-model="state.password" class="block w-full" placeholder="Password..."/>
          </UFormField>
          <UFormField label="Confirm Password" name="confirmPassword">
            <PasswordField v-model="state.confirmPassword" class="block w-full" placeholder="Confirm password..."/>
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