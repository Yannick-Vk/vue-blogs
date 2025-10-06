<script setup lang="ts">
import {ref, reactive} from "vue";
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
const error = ref<string | null>(null);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    error.value = null;
    const roleName = event.data.roleName;

    toast.add({
      title: `Successfully created ${roleName}`,
      description: `Creation of Role ${roleName} was successful`,
      color: 'success',
      icon: "lucide:user-plus",
    })
  } catch (error) {
    console.error(error)
    error.value = error
  }
}
</script>

<template>
  <h2 class="text-xl">Create a new role</h2>
  <div v-if="error">
    <UAlert type="danger">Something went wrong, {{error}}</UAlert>
  </div>
  <div v-else>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Role name" name="roleName">
        <UInput v-model="state.roleName" class="w-60"/>
      </UFormField>

      <UButton type="submit">
        Create new role
      </UButton>
    </UForm>
  </div>

</template>

