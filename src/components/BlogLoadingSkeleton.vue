<script lang="ts" setup>

</script>

<template>
  <div class="flex justify-center py-4">
    <UIcon class="size-8 animate-spin" name="lucide:loader-circle"></UIcon>
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
</template>

<style scoped>

</style>