<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBlogStore } from "@/stores/blogStore";
import { storeToRefs } from "pinia";

const route = useRoute();
const blogStore = useBlogStore();
const { currentBlog } = storeToRefs(blogStore);

onMounted(() => {
  const blogId = route.params.id as string;
  blogStore.getBlogById(blogId);
});
</script>

<template>
  <div v-if="currentBlog" class="p-4">
    <h1 class="text-3xl font-bold mb-2">{{ currentBlog.title }}</h1>
    <p class="text-gray-500 mb-4">by {{ currentBlog.author }} on {{ new Date(currentBlog.created_at).toLocaleDateString() }}</p>
    <div class="prose max-w-none">
      {{ currentBlog.description }}
    </div>
  </div>
  <div v-else class="p-4">
    <p>Loading blog post...</p>
  </div>
</template>
