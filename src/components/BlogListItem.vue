<script setup lang="ts">
import {type Blog, useBlogStore} from "@/stores/blogStore.ts";
import {ref, onMounted} from "vue";

interface Props {
  blog: Blog
}

const props = defineProps<Props>();
const blogStore = useBlogStore();

const bannerImage = ref<string | null>(null);

onMounted(async () => {
  const banner = await blogStore.getBanner(props.blog.id);
  bannerImage.value = banner;
})

</script>

<template>
  <UBlogPost
      :title="blog.title"
      :description="blog.description"
      :image="bannerImage?? 'https://nuxt.com/assets/blog/nuxt-icon/cover.png'"
      :date="blog.createdAt"
      :to="'/blog/' + blog.id"
      orientation="vertical"
      variant="soft"
      :authors="blog.authors"
  />
</template>