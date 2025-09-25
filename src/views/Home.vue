<script lang="ts" setup>
import {onMounted} from "vue";
import {useAuthStore} from "@/stores/auth.ts";
import {useBlogStore} from "@/stores/blogStore.ts";
import {storeToRefs} from "pinia";

const {user} = storeToRefs(useAuthStore());
const blogStore = useBlogStore();
const {blogs} = storeToRefs(blogStore);

onMounted(() => {
  blogStore.GetAllBlogs();
});
</script>

<template>
  <main>
    <UButton class="my-3">
      <span v-if="user">Welcome {{ user.username }}!</span>
      <span v-else>Welcome!</span>
    </UButton>

    <blog-list :blogs="blogs"/>
  </main>
</template>