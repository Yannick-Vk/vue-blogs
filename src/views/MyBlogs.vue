<script setup lang="ts">
import {useBlogStore} from "@/stores/blogStore.ts";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";
import BlogLoadingSkeleton from "@/components/BlogLoadingSkeleton.vue";

const blogStore = useBlogStore();
const {blogs, loading} = storeToRefs(blogStore);

onMounted(async () => {
  await blogStore.getBlogsByUser();
})
</script>

<template>
  <div v-if="loading">
    <BlogLoadingSkeleton/>
  </div>
  <div v-else-if="blogs.length > 0">
    <BlogList :blogs="blogs"/>
  </div>
  <div v-else class="no-blogs-message">
    <UCard variant="subtle">
      <h2 class="text-2xl text-primary mb-5">You have no blogs yet.</h2>
      <p>Click the button below to create your first blog post!</p>
      <UButton color="primary" variant="outline" icon="lucide:edit" to="/blog/new" class="mt-5">Create blog</UButton>
    </UCard>
  </div>
</template>

<style scoped>
.no-blogs-message {
  text-align: center;
  margin-top: 50px;
}
</style>
