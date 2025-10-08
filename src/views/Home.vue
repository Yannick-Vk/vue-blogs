<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {useBlogStore} from "@/stores/blogStore.ts";
import {storeToRefs} from "pinia";
import HeroComponent from "@/components/HeroComponent.vue";

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
  <UCard class="my-3 flex flex-row gap-3 justify-center" color="primary" variant="subtle">
    <SearchBox v-model:search-term="searchTerm" class="w-96" title="Search blogs..."/>
  </UCard>
  <div v-if="blogs.length === 0 || filteredBlogs.length > 0">
    <blog-list :blogs="filteredBlogs" :error="error"/>
  </div>
  <div v-else>
    <UCard variant="subtle">
      <h2 class="text-2xl text-primary mb-5">No results</h2>
      <p>No blogs found matching your search term.</p>
    </UCard>
  </div>
</template>