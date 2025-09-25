<script setup lang="ts">
import {ref} from "vue";

const blogs = ref<Array<string>>(["jeff"]);
</script>

<template>
  <UPageList>
    <blog-list-item v-for="blog in blogs" :key="blog" :title="blog" icon="lucide:user" description="demo" />
  </UPageList>
</template>

<style scoped>

</style>