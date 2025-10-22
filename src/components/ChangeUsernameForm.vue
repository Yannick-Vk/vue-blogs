<script lang="ts" setup>
import * as z from 'zod'
import {reactive} from "vue";
import type {FormSubmitEvent} from "@nuxt/ui";

const schema = z.object({
  username: z.string('Username is required'),
  password: z.string("Password is required").min(8, "Password requires at least 8 tokens"),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
  password: undefined,
})

const emit = defineEmits(['submit'])

function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('submit', event.data.username, event.data.password)
  // Always reset the password
  state.password = undefined;
}

// Expose the reset function
defineExpose({
  reset
})

// Reset the email when submit-result was a success
function reset() {
  state.username = undefined
}
</script>

<template>
  <UCard variant="subtle">
    <h3 class="text-lg mb-3 text-primary">Change Username</h3>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Username" name="username">
        <UInput v-model="state.username" class="w-full" placeholder="Please enter new username ..."/>
      </UFormField>

      <UFormField label="Password" name="password">
        <PasswordField v-model="state.password" class="block w-full"/>
      </UFormField>

      <UButton type="submit">
        Change username
      </UButton>
    </UForm>
  </UCard>
</template>