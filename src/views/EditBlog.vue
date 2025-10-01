<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";
import {useRoute} from "vue-router";
import {useBlogStore} from "@/stores/blogStore.ts";
import {storeToRefs} from "pinia";
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'

const route = useRoute();
const blogStore = useBlogStore();
const {currentBlog} = storeToRefs(blogStore);
const error = blogStore.error;

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Home',
    icon: 'lucide:home',
    to: '/'
  }, {
    label: 'Blog',
    icon: 'lucide:app-window',
    to: `/blog/${currentBlog.value?.id ?? "unknown"}`
  }, {
    label: 'Blog',
    icon: 'lucide:edit',
    to: `/blog/${currentBlog.value?.id ?? "unknown"}/edit`
  },
])


onMounted(async () => {
  const blogId = route.params.id as string;
  await blogStore.getBlogById(blogId);
});

const schema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  blogContent: z.instanceof(File)
      .refine((file) => file.name.endsWith('.md'), "Only .md files are allowed").optional(),
  bannerImage: z.instanceof(File)
      .refine((file) => file.type.startsWith('image/'), "Only image files are allowed").optional(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
  blogContent: undefined,
  bannerImage: undefined,
})

watch(currentBlog, (blog) => {
  if (blog) {
    state.title = blog.title
    state.description = blog.description
  }
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({title: 'Updated blog!', description: 'Blog updated', color: 'success'})
  console.log(event.data)
}
</script>

<template>
  <div v-if="currentBlog" class="p-4">
    <UBreadcrumb :items="items"/>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
      <UPageCard class="w-full max-w-md">
        <template #header>
          <h2 class="text-2xl">Update blog</h2>
        </template>

        <template #body>
          <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
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
  </div>
  <div v-else>
    Loading blog ...
  </div>
</template>

<style scoped>

</style>