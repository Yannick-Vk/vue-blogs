<script lang="ts" setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from "@/components/NavBar.vue";
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchUser();
});
</script>

<template>
  <UApp>
    <nav>
      <div>
        <NavBar/>
      </div>
    </nav>
    <UContainer class="mt-3">
      <RouterView/>
    </UContainer>
  </UApp>
</template>

<style scoped>
@media (min-width: 1024px) {
}
</style>
