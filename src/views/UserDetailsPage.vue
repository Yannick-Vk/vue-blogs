<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const userId = route.params.id;
</script>

<template>
  <div>
    <h1>User Details Page</h1>
    <p>User ID: {{ userId }}</p>
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh; /* Full viewport height */
  text-align: center;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

p {
  font-size: 1.5em;
}
</style>