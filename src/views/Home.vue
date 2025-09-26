<script lang="ts" setup>
import {onMounted} from "vue";
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
</script>

<template>
  <HeroComponent/>

  <blog-list :blogs="blogs" :error="error"/>
</template>