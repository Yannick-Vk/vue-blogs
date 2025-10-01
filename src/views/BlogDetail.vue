<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useBlogStore} from "@/stores/blogStore";
import {storeToRefs} from "pinia";
import {DateTime} from "luxon";
import 'highlight.js/styles/tokyo-night-dark.css';
import showdownHighlight from 'showdown-highlight';
import {VueShowdown} from "vue-showdown";
import router from "@/router/routes.ts";
import {useAuthStore} from "@/stores/auth.ts";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";

const route = useRoute();
const blogStore = useBlogStore();
const {currentBlog} = storeToRefs(blogStore);
const error = blogStore.error;

const toast = useToast();

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Home',
    icon: 'lucide:home',
    to: '/'
  },  {
    label: 'Blog',
    icon: 'lucide:app-window',
    to: `/blog/${currentBlog.value?.id?? "unknown"}`
  },
])

onMounted(async () => {
  const blogId = route.params.id as string;
  await blogStore.getBlogById(blogId);
  const id = currentBlog.value?.id;
  if (id) {
    bannerImage.value = await blogStore.getBanner(id);
  }
});
const bannerImage = ref<string | null>(null);
const authStore = useAuthStore();
const {user} = storeToRefs(authStore);

const loggedInUserIsAuthor = computed(() => {
  if (!user.value || !currentBlog.value?.authors) {
    console.warn("Not logged in or blog has no value")
    return false;
  }
  return currentBlog.value.authors.some(author => author.name === user.value?.username);

})

async function deleteBlog() {
  if (currentBlog.value) {
    const blog = await blogStore.deleteBlog(currentBlog.value.id)
    if (error) {
      toast.add({
        title: 'Failed to delete blog!',
        icon: "lucide:circle-x",
        description: `Failed to delete blog '${error}'`,
        color: 'error'
      })
      return;
    }
    toast.add({
      title: 'Delete Successful!',
      icon: "lucide:lucide:trash-2",
      description: `Successfully delete blog '${blog!.title}'`,
      color: 'success'
    })
    await router.push(`/`)
  }
}

async function editBlog() {
  if (!currentBlog.value) {
    console.warn("Not logged in or blog has no value")
    return;
  }
  await router.push(`/blog/${currentBlog.value.id}/edit`);
}

function formatDate(date: string) {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);
}
</script>

<template>
  <div v-if="currentBlog" class="p-4">
    <UBreadcrumb separator-icon="lucide:chevron-right" :items="items"/>
    <UPageHero
        :title="currentBlog.title"
        :description="currentBlog.description"
        orientation="horizontal"
    >
      <img
          :src="bannerImage?? 'https://nuxt.com/assets/blog/nuxt-icon/cover.png'"
          alt="App screenshot"
          class="rounded-lg shadow-2xl ring ring-default"
      />
      <template #body>
        <p class="text-gray-500 mb-4">
          Created on {{ formatDate(currentBlog.createdAt) }}
          <span v-if="currentBlog.updatedAt"
                class="text-gray-500 mb-4">edited on {{ formatDate(currentBlog.updatedAt) }}</span>
        </p>

        <div v-for="(author, key) in currentBlog.authors" :key="key" class="flex items-center gap-2 mb-2">
          <UTooltip :text="author.name">
            <UAvatar :src="author.avatar?.src" :alt="author.description" class="mr-2"/>
          </UTooltip>
          <span>{{ author.name }}</span>
        </div>
      </template>
      <template #links>
        <div v-if="loggedInUserIsAuthor" class="mt-5 flex flex-row gap-5">

          <UButton @click="editBlog" color="primary" icon="lucide:clipboard-pen">Edit blog</UButton>

          <UModal
              title="Confirm deletion"
          >
            <UButton color="error" icon="lucide:trash-2">Delete blog</UButton>
            <template #body>
              <p>Confirming delete of blog: `{{ currentBlog.title }}`</p>
              <p>Are you sure you want to delete this blog forever?</p>
            </template>

            <template #footer="{ close }">
              <UButton label="Cancel" color="neutral" variant="outline" @click="close"/>
              <UButton label="Delete" color="error" @click="deleteBlog"/>
            </template>
          </UModal>
        </div>
      </template>
    </UPageHero>

    <div v-if="currentBlog.content" class="prose max-w-none">
      <VueShowdown
          :markdown="currentBlog.content"
          flavor="github"
          :options="{ emoji: true }"
          :extensions="[showdownHighlight({pre: true})]"
      />
    </div>
    <div v-else>
      <UAlert
          title="No blog content found"
          color="error"
          variant="outline"
          icon="lucide:server-off"
          class="my-4"
          :ui="{
        title: 'text-2xl font-bold',
        icon: 'size-8'
      }"
      />
    </div>


  </div>
  <div v-else class="p-4">
    <p>Loading blog post...</p>
  </div>
</template>

<style>
/*
  This style block counteracts the Tailwind Typography plugin (`prose`)
  which strips styling from code blocks, allowing the highlight.js theme to work.
*/

/*
  1. The `prose` class removes the background from `pre` elements.
     We re-apply the background color from your chosen theme (tokyo-night-dark).
*/
.prose pre {
  background-color: #1a1b26;
  border-radius: 8px;
}

/*
  2. The `prose` class also interferes with text color on `code` elements.
     We reset a few properties here so the highlight.js theme can take over.
*/
.prose pre code {
  color: #c5c5c5;
  background-color: transparent;
  font-weight: inherit;
  font-size: inherit;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

/*
  3. Now, your custom overrides will work as expected.
*/
.prose .hljs-comment {
  color: #7a7a7a;
  font-style: italic;
}

.prose .hljs-string {
  color: #8af1b7;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  color: var(--color-primary-800);
}

.prose h1 {
  font-size: 2.5rem;
}
</style>