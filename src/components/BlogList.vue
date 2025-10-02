<script setup lang="ts">
import {type Blog} from "@/stores/blogStore.ts";
import BlogLoadingSkeleton from "@/components/BlogLoadingSkeleton.vue";

interface Props {
  blogs?: Blog[];
  error?: string | null;
}

const props = defineProps<Props>();
</script>

<template>
  <div v-if="error" class="mx-auto max-w-2xl">
    <UAlert
      :title="error"
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
  <UBlogPosts v-else-if="blogs && blogs.length > 0" class="mb-10">
    <blog-list-item v-for="(blog, index) in blogs" :key="index" :blog="blog" />
  </UBlogPosts>
  <div v-else>
    <BlogLoadingSkeleton/>
  </div>
</template>

<style scoped>

</style>