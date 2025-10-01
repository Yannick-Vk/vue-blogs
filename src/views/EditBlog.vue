<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";
import {useRoute} from "vue-router";
import {useBlogStore} from "@/stores/blogStore.ts";
import {storeToRefs} from "pinia";

const route = useRoute();
const blogStore = useBlogStore();
const {currentBlog} = storeToRefs(blogStore);
const error = blogStore.error;

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Home',
    icon: 'lucide:home',
    to: '/'
  }, {
    label: 'Blog',
    icon: 'lucide:app-window',
    to: `/blog/${currentBlog.value?.id ?? "unknown"}`
  }, {
    label: 'Blog',
    icon: 'lucide:edit',
    to: `/blog/${currentBlog.value?.id ?? "unknown"}/edit`
  },
])


onMounted(async () => {
  const blogId = route.params.id as string;
  await blogStore.getBlogById(blogId);
});
</script>

<template>
  <div v-if="currentBlog" class="p-4">
    <UBreadcrumb :items="items"/>
  </div>
  <div v-else>
    Loading blog ...
  </div>
</template>

<style scoped>

</style>