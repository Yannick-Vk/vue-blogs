<script lang="ts" setup>
import {type Blog} from "@/stores/blogStore.ts";
import BlogLoadingSkeleton from "@/components/BlogLoadingSkeleton.vue";

interface Props {
  blogs?: Blog[];
  error?: string | null;
}

const props = defineProps<Props>();
</script>

<template>
  <div v-if="error" class="mx-auto">
    <UAlert
        :title="error"
        :ui="{
        title: 'text-2xl font-bold',
        icon: 'size-8'
      }"
        class="my-4 text-center"
        color="error"
        icon="lucide:server-off"
        variant="outline"
    />
  </div>
  <UBlogPosts v-else-if="blogs && blogs.length > 0" class="mb-10">
    <blog-list-item v-for="(blog) in blogs" :key="blog.id" :blog="blog"/>
  </UBlogPosts>
  <div v-else>
    <BlogLoadingSkeleton/>
  </div>
</template>

<style scoped>

</style>