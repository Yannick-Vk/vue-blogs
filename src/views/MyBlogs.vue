<script lang="ts" setup>
import {useBlogStore} from "@/stores/blogStore.ts";
import {storeToRefs} from "pinia";
import {computed, onMounted, ref} from "vue";
import BlogLoadingSkeleton from "@/components/BlogLoadingSkeleton.vue";
import SearchBox from "@/components/SearchBox.vue";

const blogStore = useBlogStore();
const {blogs, loading} = storeToRefs(blogStore);
const searchTerm = ref<string>("");

onMounted(async () => {
  await blogStore.getBlogsByUser();
})

const filteredBlogs = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (term.length < 1) {
    return blogs.value;
  }
  return blogs.value.filter((blog) => blog.title.toLowerCase().includes(term));
});

</script>

<template>
  <div v-if="loading">
    <BlogLoadingSkeleton/>
  </div>
  <div v-else-if="blogs.length > 0">
    <UCard class="mb-5 text-center" variant="subtle">
      <h2 class="text-2xl text-primary">My blogs</h2>
      <p>You've created {{ blogs.length }} blogs!</p>
      <div class="mt-5 flex flex-row gap-5 justify-center">
        <SearchBox v-model:searchTerm="searchTerm" title="Search blogs..."/>
      </div>

    </UCard>
    <div v-if="filteredBlogs.length > 0">
      <BlogList :blogs="filteredBlogs"/>
    </div>
    <div v-else>
      <UCard variant="subtle">
        <h2 class="text-2xl text-primary mb-5">No results</h2>
        <p>No blogs found matching your search term.</p>
      </UCard>
    </div>
  </div>
  <div v-else>
    <UCard variant="subtle">
      <h2 class="text-2xl text-primary mb-5">You have no blogs yet.</h2>
      <p>Click the button below to create your first blog post!</p>
      <UButton class="mt-5" color="primary" icon="lucide:edit" to="/blog/new" variant="outline">Create blog</UButton>
    </UCard>
  </div>
</template>