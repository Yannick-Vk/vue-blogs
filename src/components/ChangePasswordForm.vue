<script lang="ts" setup>
import * as z from 'zod'
import {reactive, useTemplateRef} from "vue";
import type {FormSubmitEvent} from "@nuxt/ui";

const schema = z.object({
  newPassword: z.string("New password is required").min(8, "New Password requires at least 8 tokens"),
  password: z.string("Password is required").min(8, "Password requires at least 8 tokens"),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  newPassword: undefined,
  password: undefined,
})

const emit = defineEmits(['submit'])

function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('submit', event.data.newPassword, event.data.password)
  reset();
}

function reset() {
  state.password = undefined;
  state.newPassword = undefined;
}


// Expose the setError function
defineExpose({
  setError
})

const form = useTemplateRef('form');

function setError(message: string) {
  console.error("set error!", message)
  form.value?.setErrors([{message: message, name: 'newPassword'}])
}
</script>

<template>
  <UCard variant="subtle">
    <h3 class="text-lg mb-3 text-primary">Change Password</h3>
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">

      <UFormField label="New Password" name="newPassword">
        <PasswordField v-model="state.newPassword" class="block w-full" placeholder="New password..."/>
      </UFormField>
      <UFormField label="Old Password" name="password">
        <PasswordField v-model="state.password" class="block w-full" placeholder="Old Password..."/>
      </UFormField>

      <UButton type="submit">
        Change password
      </UButton>
    </UForm>
  </UCard>
</template>