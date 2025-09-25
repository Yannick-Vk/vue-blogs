<script setup lang="ts">
import {ref} from "vue";

const blogs = ref<Array<string>>(["jeff"]);
</script>

<template>
  <UPageList>
    <UPageCard
        v-for="(blog, index) in blogs"
        :key="index"
        variant="ghost"
    >
      <template #body>
        <BlogListItem />
      </template>
    </UPageCard>
  </UPageList>
</template>

<style scoped>

</style>