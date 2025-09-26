<script setup lang="ts">
import type {Blog} from "@/stores/blogStore.ts";

interface Props {
  blogs?: Blog[];
}

defineProps<Props>();
</script>

<template>
  <UPageList divide v-if="blogs && blogs.length > 0">
    <blog-list-item class="my-3" v-for="blog in blogs" :key="blog.id"
                    :title="blog.title"
                    :description="blog.description"
                    :author="blog.author"
                    :date="blog.createdAt"
                    :to="{ name: 'blog-detail', params: { id: blog.id } }"
    />
  </UPageList>
  <div v-else class="my-3 justify-center text-center text-gray-500 text-2xl">
    Blogs are loading...
  </div>
</template>

<style scoped>

</style>