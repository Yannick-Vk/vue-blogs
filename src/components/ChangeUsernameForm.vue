<script lang="ts" setup>
import * as z from 'zod'
import {reactive, ref} from "vue";
import type {FormSubmitEvent} from "@nuxt/ui";
import type {Form} from "#ui/types";

const schema = z.object({
  username: z.string('Username is required'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
})

const form = ref<Form<Schema>>()
const emit = defineEmits(['submit'])

function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('submit', event.data.username)
}

// Expose the reset function
defineExpose({
  reset, setError
})

// Reset the email when submit-result was a success
function reset() {
  state.username = undefined
}

function setError(message: string) {
  console.error("set error!", message)
  form.value.setErrors([{message: message, name: 'username'}])
}
</script>

<template>
  <UCard variant="subtle">
    <h3 class="text-lg mb-3 text-primary">Change Username</h3>
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Username" name="username">
        <UInput v-model="state.username" class="w-full" placeholder="Please enter new username ..."/>
      </UFormField>

      <UButton type="submit">
        Change username
      </UButton>
    </UForm>
  </UCard>
</template>