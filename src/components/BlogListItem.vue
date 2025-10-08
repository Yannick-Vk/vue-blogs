<script lang="ts" setup>
import {type Blog, useBlogStore} from "@/stores/blogStore.ts";
import {onMounted, ref} from "vue";

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
      :authors="blog.authors"
      :date="blog.createdAt"
      :description="blog.description"
      :image="bannerImage?? 'https://nuxt.com/assets/blog/nuxt-icon/cover.png'"
      :title="blog.title"
      :to="'/blog/' + blog.id"
      orientation="vertical"
      variant="soft"
  />
</template>