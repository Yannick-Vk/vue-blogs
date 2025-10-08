<script lang="ts" setup>
import {reactive} from "vue";
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'

const schema = z.object({
  roleName: z.string('Role-name cannot be empty'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  roleName: undefined,
})

const toast = useToast()
const emit = defineEmits<{
  (e: 'submit', roleName: string): void
}>()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('submit', event.data.roleName);
}
</script>

<template>
  <h2 class="text-xl">Create a new role</h2>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Role name" name="roleName">
      <UInput v-model="state.roleName" class="w-60"/>
    </UFormField>

    <UButton type="submit">
      Create new role
    </UButton>
  </UForm>
</template>

