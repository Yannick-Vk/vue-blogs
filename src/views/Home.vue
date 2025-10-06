<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {useAuthStore} from "@/stores/auth.ts";
import {useBlogStore} from "@/stores/blogStore.ts";
import {storeToRefs} from "pinia";
import HeroComponent from "@/components/HeroComponent.vue";

const {user} = storeToRefs(useAuthStore());
const blogStore = useBlogStore();
const {blogs, error} = storeToRefs(blogStore);

onMounted(() => {
  blogStore.getAllBlogs();
});

const searchTerm = ref<string>("");

const filteredBlogs = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (term.length < 1) {
    return blogs.value;
  }
  return blogs.value.filter((blog) => blog.title.toLowerCase().includes(term));
});
</script>

<template>
  <HeroComponent/>
  <UCard variant="subtle" color="primary" class="my-3 flex flex-row gap-3 justify-center">
    <p class="text-lg mb-3">Search blogs: </p>
    <SearchBox v-model:search-term="searchTerm" title="Search blogs..." />
  </UCard>
  <blog-list :blogs="filteredBlogs" :error="error"/>
</template>