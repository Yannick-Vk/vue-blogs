<script setup lang="ts">
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {reactive} from "vue";

const schema = z.object({
  username: z.string(),
  password: z.string()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
  password: undefined
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({title: 'Success', description: 'The form has been submitted.', color: 'success'})
  console.log(event.data)
}
</script>

<template>
  <div class="flex justify-center">
    <UCard variant="subtle">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Username/Email" name="username">
          <UInput v-model="state.username"/>
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