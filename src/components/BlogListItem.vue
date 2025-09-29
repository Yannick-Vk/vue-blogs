<script setup lang="ts">
import type {Blog} from "@/stores/blogStore.ts";

interface Props {
  blog: Blog
}

const props = defineProps<Props>();
</script>

<template>
  <UBlogPost
      :title="blog.title"
      :description="blog.description"
      :image="blog.bannerImage?? 'https://nuxt.com/assets/blog/nuxt-icon/cover.png'"
      :date="blog.createdAt"
      :to="'/blog/' + blog.id"
      orientation="vertical"
      variant="soft"
      :authors="blog.authors"
  />
</template>