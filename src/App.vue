<script lang="ts" setup>
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView/>
</template>

<style scoped>
@media (min-width: 1024px) {
}
</style>
