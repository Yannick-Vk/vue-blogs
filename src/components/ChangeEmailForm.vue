<script lang="ts" setup>
import * as z from 'zod'
import {reactive} from "vue";
import type {FormSubmitEvent} from "@nuxt/ui";

const schema = z.object({
  email: z.email('Email is required'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
})

const emit = defineEmits(['submit'])

function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('submit', event.data.email,)
}

// Expose the reset function
defineExpose({
  reset
})

// Reset the email when submit-result was a success
function reset() {
  state.email = undefined
}
</script>

<template>
  <UCard variant="subtle">
    <h3 class="text-lg mb-3 text-primary">Change email</h3>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" class="w-full" placeholder="Please enter new email ..." type="email"/>
      </UFormField>

      <UButton type="submit">
        Change email
      </UButton>
    </UForm>
  </UCard>
</template>