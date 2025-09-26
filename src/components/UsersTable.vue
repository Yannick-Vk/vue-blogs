<script setup lang="ts">
import {ref} from "vue";

const props = defineProps({
  isLoading: Boolean,
  data: Array,
});

</script>

<template>
  <UTable :loading="isLoading" sticky loading-color="primary" loading-animation="carousel" :data="data" class="flex-1 max-h-[70vh]"/>
</template>
