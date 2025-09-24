<script setup lang="ts">
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {reactive} from "vue";

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.dir(state)
  toast.add({title: 'Success', description: 'The form has been submitted.', color: 'success'})
  console.log(event.data)
}
</script>

<template>
  <div class="flex justify-center">
    <UCard variant="subtle">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Email" name="email">
          <UInput v-model="state.email"/>
        </UFormField>

        <UFormField label="Password" name="password">
          <PasswordField v-model="state.password"></PasswordField>
        </UFormField>

        <UButton type="submit">
          Submit
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>