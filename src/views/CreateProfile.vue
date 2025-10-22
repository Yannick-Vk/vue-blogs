<script lang="ts" setup>
import * as z from 'zod'
import {reactive} from "vue";
import type {FormSubmitEvent} from "@nuxt/ui";

const schema = z.object({
  username: z.string('Username is required'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
})

const emit = defineEmits(['submit'])

function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('submit', event.data.username)
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
  <UCard variant="subtle" class="mt-5">
    <h3 class="text-lg mb-3 text-primary">Create profile</h3>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Username" name="username">
        <UInput v-model="state.username" class="w-full" placeholder="Please enter a username ..."/>
      </UFormField>

      <UButton type="submit">
        Create profile
      </UButton>
    </UForm>
  </UCard>
</template>