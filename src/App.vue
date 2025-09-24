<script lang="ts" setup>
import {RouterView} from 'vue-router'
import NavBar from "@/components/NavBar.vue";
</script>

<template>
  <UApp>
    <nav>
      <div>
        <NavBar/>
      </div>
    </nav>

    <RouterView/>
  </UApp>
</template>

<style scoped>
@media (min-width: 1024px) {
}
</style>
