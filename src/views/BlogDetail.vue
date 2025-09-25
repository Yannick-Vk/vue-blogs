<script setup lang="ts">
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import {useBlogStore} from "@/stores/blogStore";
import {storeToRefs} from "pinia";
import {DateTime} from "luxon";
import 'highlight.js/styles/tokyo-night-dark.css';
import showdownHighlight from 'showdown-highlight';

const route = useRoute();
const blogStore = useBlogStore();
const {currentBlog} = storeToRefs(blogStore);

onMounted(() => {
  const blogId = route.params.id as string;
  blogStore.getBlogById(blogId);
});
</script>

<template>
  <div v-if="currentBlog" class="p-4">
    <h1 class="text-3xl font-bold mb-2">{{ currentBlog.title }}</h1>
    <p class="text-gray-500 mb-4">
      by {{ currentBlog.author }} on {{ DateTime.fromISO(currentBlog.createdAt).toLocaleString(DateTime.DATE_MED) }}
      <span v-if="currentBlog.updatedAt"
            class="text-gray-500 mb-4">edited on {{ DateTime.fromISO(currentBlog.updatedAt).toLocaleString(DateTime.DATE_MED) }}</span>
    </p>

    <div class="prose max-w-none">
      {{ currentBlog.description }}
    </div>

    <div v-if="currentBlog.blogContent">
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
