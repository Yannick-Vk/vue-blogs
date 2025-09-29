<script setup lang="ts">
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import {useBlogStore} from "@/stores/blogStore";
import {storeToRefs} from "pinia";
import {DateTime} from "luxon";
import 'highlight.js/styles/tokyo-night-dark.css';
import showdownHighlight from 'showdown-highlight';
import {VueShowdown} from "vue-showdown";
import router from "@/router/routes.ts";

const route = useRoute();
const blogStore = useBlogStore();
const {currentBlog} = storeToRefs(blogStore);
const error = blogStore.error;

const toast = useToast();

onMounted(async () => {
  const blogId = route.params.id as string;
  await blogStore.getBlogById(blogId);
  console.dir(currentBlog.value);
});

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
      description: `Successfully delete blog '${blog.title}'`,
      color: 'success'
    })
    await router.push(`/`)
  }
}
</script>

<template>
  <div v-if="currentBlog" class="p-4">
    <UButton to="/" icon="lucide:arrow-left" class="mb-5">Back to blogs</UButton>
    <h1 class="text-3xl font-bold mb-2">{{ currentBlog.title }}</h1>
    <p class="text-gray-500 mb-4">
      Created on {{ DateTime.fromISO(currentBlog.createdAt).toLocaleString(DateTime.DATE_MED) }}
      <span v-if="currentBlog.updatedAt"
            class="text-gray-500 mb-4">edited on {{
          DateTime.fromISO(currentBlog.updatedAt).toLocaleString(DateTime.DATE_MED)
        }}</span>
    </p>

    <div v-for="(author, key) in currentBlog.authors" :key="key" class="flex items-center gap-2 mb-2">
      <UTooltip :text="author.name">
        <UAvatar :src="author.avatar?.src" :alt="author.description" class="mr-2"/>
      </UTooltip>
      <span>{{ author.name }}</span>
    </div>

    <div class="mt-5">
      <UButton @click="deleteBlog" color="error">Delete blog</UButton>
    </div>


    <USeparator type="solid" size="sm" class="my-4"/>

    <div v-if="currentBlog.blogContent" class="prose max-w-none">
      <VueShowdown
          :markdown="currentBlog.blogContent"
          flavor="github"
          :options="{ emoji: true }"
          :extensions="[showdownHighlight({pre: true})]"
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