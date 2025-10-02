<script setup lang="ts">
import {useBlogStore} from "@/stores/blogStore.ts";
import {storeToRefs} from "pinia";
import {onMounted, ref} from "vue";
import BlogLoadingSkeleton from "@/components/BlogLoadingSkeleton.vue";

const blogStore = useBlogStore();
const {blogs, loading} = storeToRefs(blogStore);
const searchTerm = ref<string>("");

onMounted(async () => {
  await blogStore.getBlogsByUser();
})

function search() {
  console.log("searching blogs for title containing:", searchTerm.value);
}
</script>

<template>
  <div v-if="loading">
    <BlogLoadingSkeleton/>
  </div>
  <div v-else-if="blogs.length > 0">
    <UCard variant="subtle" class="mb-5 text-center">
      <h2 class="text-2xl">My blogs</h2>
      <p>You've created {{blogs.length}} blogs!</p>
      <UForm @submit="search" >
        <UInput
            v-model="searchTerm"
            placeholder="Type something..."
            :ui="{ trailing: 'pe-1' }"
            size="xl"
            class="mt-5"
        >
          <template v-if="searchTerm?.length" #trailing>
            <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="lucide:circle-x"
                aria-label="Clear input"
                @click="searchTerm = ''"
            />
          </template>
        </UInput>
        <UButton type="submit" color="neutral" variant="link">Search</UButton>
      </UForm>

    </UCard>
    <BlogList :blogs="blogs"/>
  </div>
  <div v-else class="no-blogs-message">
    <UCard variant="subtle">
      <h2 class="text-2xl text-primary mb-5">You have no blogs yet.</h2>
      <p>Click the button below to create your first blog post!</p>
      <UButton color="primary" variant="outline" icon="lucide:edit" to="/blog/new" class="mt-5">Create blog</UButton>
    </UCard>
  </div>
</template>

<style scoped>
.no-blogs-message {
  text-align: center;
  margin-top: 50px;
}
</style>
