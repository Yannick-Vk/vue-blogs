<script setup lang="ts">
import {useBlogStore} from "@/stores/blogStore.ts";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";

const blogStore = useBlogStore();
const {blogs} = storeToRefs(blogStore);

onMounted(async () => {
  await blogStore.getBlogsByUser();
})
</script>

<template>
  <BlogList :blogs="blogs"/>
</template>

<style scoped>
</style>