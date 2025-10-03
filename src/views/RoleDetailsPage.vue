<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute();
const roleName = route.params.id as string;

</script>

<template>
  <h2 class="text-2xl text-primary-300">{{roleName}}</h2>
</template>

<style scoped>

</style>