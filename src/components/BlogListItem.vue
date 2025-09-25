<script setup lang="ts">
type orientationEnum = "horizontal" | "vertical";

withDefaults(defineProps<{
  title: string,
  description: string,
  icon: string,
  orientation?: orientationEnum,
  to?: string | object
}>(), {
  orientation: "horizontal"
})
</script>

<template>
  <UPageCard
      :to="to"
      :title="title"
      :description="description"
      :icon="icon"
      :orientation="orientation"
      spotlight
      spotlight-color="primary"
  >
    <div>

    </div>
  </UPageCard>
</template>