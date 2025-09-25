<script setup lang="ts">
type orientationEnum = "horizontal" | "vertical";

withDefaults(defineProps<{
  title: string,
  description: string,
  orientation?: orientationEnum,
  to?: string | object,
  date: string,
  author: string,
}>(), {
  orientation: "horizontal"
})
</script>

<template>
  <UBlogPost
      :title="title"
      :description="description"
      image="https://nuxt.com/assets/blog/nuxt-icon/cover.png"
      :date="date"
      :to="to"
      orientation="horizontal"
      variant="outline"
      :authors="[{
    name: author,
    description: 'User Name',
    avatar: {
      src: 'https://github.com/antfu.png'
    },
    to: 'https://github.com/antfu',
    target: '_blank'
  }]"
  />
</template>