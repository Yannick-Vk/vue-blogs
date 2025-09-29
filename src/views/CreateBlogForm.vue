<script setup lang="ts">
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {reactive} from "vue";

const schema = z.object({
  title: z.string('Title is required'),
  description: z.string('Description is required'),
  blogContent: z.file('A blog file is required'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
  blogContent: undefined,
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({title: 'Success', description: 'The form has been submitted.', color: 'success'})
  console.log(event.data)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl">Create a new Blog</h2>
      </template>

      <template #body>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Title" name="title">
            <UInput v-model="state.title" class="w-full"/>
          </UFormField>

          <UFormField label="Description" name="description">
            <UTextarea v-model="state.description" placeholder="Enter description ..." class="w-full"/>
          </UFormField>

          <UFormField label="Blog file" name="blogContent">
            <UFileUpload v-model="state.blogContent" accept="md" label="Click or Drop your blog file here"
                         class="w-full min-h-48"/>
          </UFormField>

          <UButton type="submit">
            Submit
          </UButton>
        </UForm>
      </template>
    </UPageCard>
  </div>
</template>

