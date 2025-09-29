<script setup lang="ts">
import * as z from 'zod'
import type {FormErrorEvent, FormSubmitEvent} from '@nuxt/ui'
import {reactive} from "vue";
import {useBlogStore} from "@/stores/blogStore.ts";
import router from "@/router/routes.ts";

const schema = z.object({
  title: z.string('Title is required'),
  description: z.string('Description is required'),
  blogContent: z.file('A blog file is required')
      .refine((file: File) => file && file.name.endsWith('.md'), "Only .md files are allowed"),
  bannerImage: z.file('A banner image is required'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
  blogContent: undefined,
  bannerImage: undefined,
})

const toast = useToast();
const blogStore = useBlogStore();


async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const blogId = await blogStore.uploadBlog(event.data);
    toast.add({
      title: `Blog ${event.data.title} uploaded`,
      description: `Your blog ${event.data.title} has been uploaded successfully`,
      color: 'success',
      icon: 'lucide:check',
      actions: [{
        icon: 'lucide:arrow-right',
        label: 'Go to blog',
        color: 'neutral',
        variant: 'outline',
        onClick: async () => {
          await router.push(`/blog/${blogId}`)
        }
      }],
    })

    await router.push(`/`)
  } catch (err) {
    console.error(err)
    let message = "Something went wrong!";
    if (err instanceof Error) {
      message = err.message
    }

    toast.add({
      title: `Blog uploaded failed`,
      description: message,
      color: 'error',
      icon: 'lucide:circle-x',
    })
  }
}

function onError(event: FormErrorEvent) {
  if (event.errors.some(value => value.name?.includes("blogContent"))) {
    state.blogContent = undefined;
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl">Create a new Blog</h2>
      </template>

      <template #body>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit" @error="onError">
          <UFormField label="Title" name="title">
            <UInput v-model="state.title" class="w-full" placeholder="Blog title"/>
          </UFormField>

          <UFormField label="Description" name="description">
            <UTextarea v-model="state.description" placeholder="Enter description ..." class="w-full"/>
          </UFormField>

          <UFormField label="Blog file" name="blogContent">
            <UFileUpload v-model="state.blogContent" accept=".md" label="Click or Drop your blog file here"
                         color="neutral"
                         highlight
                         variant="button"
                         class="min-h-48 w-96"/>
          </UFormField>

          <UFormField label="Blog file" name="blogContent">
            <UFileUpload v-model="state.bannerImage" accept="images/*" label="Click or Drop your banner image here"
                         color="neutral"
                         highlight
                         class="min-h-48 w-96"/>
          </UFormField>

          <UButton type="submit">
            Submit
          </UButton>
        </UForm>
      </template>
    </UPageCard>
  </div>
</template>

