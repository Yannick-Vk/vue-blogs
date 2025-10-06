<script setup lang="ts">
import * as z from 'zod'
import {reactive} from "vue";
import type {FormSubmitEvent} from "@nuxt/ui";

const schema = z.object({
  email: z.email('Email is required'),
  password: z.string("Password is required").min(8, "Password requires at least 8 tokens"),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
})

const emit = defineEmits(['submit'])

function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('submit', event.data.email, event.data.password)
}
</script>

<template>
  <UCard variant="subtle" class="my-4">
    <h3 class="text-lg mb-3 text-primary">Change email</h3>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit" >
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" type="email" placeholder="Please enter new email ..." class="w-full"/>
      </UFormField>

      <PasswordField v-model="state.password" class="block w-full"/>

      <UButton type="submit">
        Change email
      </UButton>
    </UForm>
  </UCard>
</template>