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
    label: 'Edit',
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
  if (!currentBlog.value) {
    toast.add({title: 'Error', description: 'Cannot update, blog not loaded.', color: 'error'});
    return;
  }

  const changedData: {
    title?: string;
    description?: string;
    blogContent?: string;
    bannerImage?: File;
  } = {};

  if (event.data.title !== undefined && event.data.title !== currentBlog.value.title) {
    changedData.title = event.data.title;
  }
  if (event.data.description !== undefined && event.data.description !== currentBlog.value.description) {
    changedData.description = event.data.description;
  }
  if (event.data.bannerImage) {
    changedData.bannerImage = event.data.bannerImage;
  }

  if (event.data.blogContent) {
    const content = await event.data.blogContent.text();
    if (content !== currentBlog.value.blogContent) {
      changedData.blogContent = content;
    }
  }

  try {
    if (Object.keys(changedData).length === 0) {
      toast.add({title: 'No Changes', description: 'No fields were changed.', color: 'secondary'});
      return;
    }

    await blogStore.updateBlog(currentBlog.value.id, changedData);
    toast.add({title: 'Blog Updated', description: 'Your blog has been successfully updated.', color: 'success'});

    // Refresh the blog data to show the latest changes
    await blogStore.getBlogById(currentBlog.value.id);

  } catch (e) {
    toast.add({title: 'Update Failed', description: blogStore.error?? "", color: 'error'});
  }
}
</script>

<template>
  <div v-if="currentBlog" class="p-4">
    <UBreadcrumb :items="items"/>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
      <SelectUser />
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