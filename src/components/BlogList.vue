<script setup lang="ts">
import type {Blog} from "@/stores/blogStore.ts";
import {computed} from "vue";

interface Props {
  blogs?: Blog[];
  error?: string | null;
}

const props = defineProps<Props>();
</script>

<template>
  <div v-if="error" class="mx-auto max-w-lg">
    <UAlert
      :title="error"
      color="error"
      variant="outline"
      icon="lucide:server-off"
      class="my-4"
      :ui="{
        title: 'text-2xl font-bold',
        icon: 'size-8'
      }"
    />
  </div>
  <UBlogPosts v-else-if="blogs && blogs.length > 0" class="mb-10">
    <blog-list-item v-for="(blog, index) in blogs" :key="index" :blog="blog" />
  </UBlogPosts>
  <div v-else>
    <div class="flex justify-center py-4">
      <UIcon name="lucide:loader-circle" class="size-8 animate-spin"></UIcon>
    </div>
    <div v-for="i in 3" :key="i" class="my-3 flex gap-4 items-center">
      <USkeleton class="h-32 w-48"/>
      <div class="space-y-2 flex-1 py-1">
        <USkeleton class="h-6 w-3/4"/>
        <USkeleton class="h-4 w-full"/>
        <USkeleton class="h-4 w-5/6"/>
        <div class="flex items-center gap-2 pt-4">
          <USkeleton class="h-8 w-8 rounded-full"/>
          <USkeleton class="h-4 w-1/4"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>