<script setup lang="ts">
import * as z from 'zod'
import type {FormErrorEvent, FormSubmitEvent} from '@nuxt/ui'
import {reactive} from "vue";
import {useBlogStore} from "@/stores/blogStore.ts";
import router from "@/router/routes.ts";

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  blogContent: z.instanceof(File, {message: 'A blog file is required'})
      .refine((file) => file.name.endsWith('.md'), "Only .md files are allowed"),
  bannerImage: z.instanceof(File, {message: 'A banner image is required'})
      .refine((file) => file.type.startsWith('image/'), "Only image files are allowed"),
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

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                const base64String = reader.result.split(',')[1];
                if (base64String) {
                    resolve(base64String);
                } else {
                    reject(new Error('Failed to extract base64 content from file'));
                }
            } else {
                reject(new Error('Failed to read file as base64'));
            }
        };
        reader.onerror = error => reject(error);
    });
}

const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read file as text'));
            }
        };
        reader.onerror = error => reject(error);
    });
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const content = await readTextFile(event.data.blogContent)

    const blogData = {
      title: event.data.title,
      description: event.data.description,
      blogContent: content,
      bannerImage: event.data.bannerImage,
    }

    const blogId = await blogStore.uploadBlog(blogData);
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
  if (event.errors.some(value => value.path.includes("blogContent"))) {
    state.blogContent = undefined;
  }
  if (event.errors.some(value => value.path.includes("bannerImage"))) {
    state.bannerImage = undefined;
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
                         class="min-h-48 w-96"/>
          </UFormField>

          <UFormField label="Banner Image" name="bannerImage">
            <UFileUpload v-model="state.bannerImage" accept="image/*" label="Click or Drop your banner image here"
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