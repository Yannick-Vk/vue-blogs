<script lang="ts" setup>
import {computed, onMounted, reactive, watch} from "vue";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";
import {useRoute} from "vue-router";
import {useBlogStore} from "@/stores/blogStore.ts";
import {storeToRefs} from "pinia";
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {useUserStore} from "@/stores/userStore.ts";
import type {User} from "@/stores/auth.ts";
import {useAuthStore} from "@/stores/auth.ts";
import type {Author} from "@/types/Author.ts";

const route = useRoute();
const blogStore = useBlogStore();
const {currentBlog} = storeToRefs(blogStore);
const error = blogStore.error;

const userStore = useUserStore();
const {users} = storeToRefs(userStore);
const authStore = useAuthStore();
const {user: loggedInUser} = storeToRefs(authStore);

const usersWithAuthorStatus = computed(() => {
  if (!users.value) {
    return [];
  }
  const authorIds = new Set(currentBlog.value?.authors?.map((author: Author) => author.name || author) || []);
  return users.value.map((user: User) => ({
    ...user,
    isAuthor: authorIds.has(user.username),
    disabled: user.id === loggedInUser.value?.id
  }));
});

const items = computed<BreadcrumbItem[]>(() => [
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
  await userStore.fetchUsers();
});

const schema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.instanceof(File)
      .refine((file) => file.name.endsWith('.md'), "Only .md files are allowed").optional(),
  bannerImage: z.instanceof(File)
      .refine((file) => file.type.startsWith('image/'), "Only image files are allowed").optional(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
  content: undefined,
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
    content?: string;
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

  if (event.data.content) {
    const content = await event.data.content.text();
    if (content !== currentBlog.value.content) {
      changedData.content = content;
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
    toast.add({title: 'Update Failed', description: blogStore.error ?? "", color: 'error'});
  }
}

async function updateAuthors(userIds: string[]) {
  try {
    await blogStore.updateAuthors(userIds);
    toast.add({title: 'Updated Authors', description: 'Your blog has been successfully updated.', color: 'success'});
  } catch (err) {
    console.error(err)
    toast.add({title: 'Error', description: `${err}`, color: 'error'});
  }
}
</script>

<template>
  <div v-if="currentBlog" class="p-4">
    <UBreadcrumb :items="items"/>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
      <Authors :users="usersWithAuthorStatus" @submit-complete="updateAuthors"/>
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
              <UTextarea v-model="state.description" class="w-full" placeholder="Enter description ..."/>
            </UFormField>

            <UFormField label="Blog file" name="content">
              <UFileUpload v-model="state.content" accept=".md" class="min-h-48 w-96"
                           color="neutral"
                           highlight
                           label="Click or Drop your blog file here"/>
            </UFormField>

            <UFormField label="Banner Image" name="bannerImage">
              <UFileUpload v-model="state.bannerImage" accept="image/*" class="min-h-48 w-96"
                           color="neutral"
                           highlight
                           label="Click or Drop your banner image here"/>
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