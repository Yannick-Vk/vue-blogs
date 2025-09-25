<script setup lang="ts">
import {ref} from "vue";

const blogs = ref<Array<string>>(["jeff", "Demo blog", "This is my new blog!"]);
</script>

<template>
  <UPageList divide>
    <blog-list-item class="my-3" v-for="blog in blogs" :key="blog" :title="blog" icon="lucide:user" description="demo" />
  </UPageList>
</template>

<style scoped>

</style>