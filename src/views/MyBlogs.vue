<script setup lang="ts">
import {useBlogStore} from "@/stores/blogStore.ts";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";

const blogStore = useBlogStore();
const {blogs, loading} = storeToRefs(blogStore);

onMounted(async () => {
  await blogStore.getBlogsByUser();
})
</script>

<template>
  <div v-if="loading">
    <div class="flex justify-center py-4">
      <UIcon name="lucide:loader-circle" class="size-8 animate-spin"></UIcon>
    </div>
    <div v-for="i in 3" :key="i" class="my-3 flex gap-4 items-center">
      <USkeleton class="h-32 w-48"/>
      <div class="space-y-2 flex-1 py-1">
        <USkeleton class="h-6 w-3/4"/>
        <USkeleton class="h-4 w-full"/>
        <USkeleton class="h-4 w-5/6"/>
        <div class="flex items-center gap-2 pt-4">
          <USkeleton class="h-8 w-8 rounded-full"/>
          <USkeleton class="h-4 w-1/4"/>
        </div>
      </div>
    </div>
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
