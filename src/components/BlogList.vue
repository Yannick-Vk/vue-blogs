<script setup lang="ts">
import type {Blog} from "@/stores/blogStore.ts";

const props = defineProps({
  blogs: Array<Blog>,
})
</script>

<template>
  <UPageList divide>
    <blog-list-item class="my-3" v-for="blog in blogs" :key="blog.id"
                    icon="lucide:user"
                    :title="blog.title"
                    :description="blog.description"
                    :to="{ name: 'blog-detail', params: { id: blog.id } }" />
  </UPageList>
</template>

<style scoped>

</style>