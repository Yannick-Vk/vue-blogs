<script lang="ts" setup>
import {onMounted} from 'vue';
import {RouterView} from 'vue-router';
import NavBar from "@/components/NavBar.vue";
import {useAuthStore} from '@/stores/auth';
import type {ToasterProps} from "@nuxt/ui/components/Toaster.vue";

const authStore = useAuthStore();
const toaster: ToasterProps = {position: 'bottom-right', expand: false};

onMounted(() => {
  authStore.fetchUser();
});
</script>

<template>
  <UApp :toaster="toaster">
    <nav>
      <div>
        <NavBar/>
      </div>
    </nav>
    <UContainer class="mt-3">
      <main>
        <RouterView/>
      </main>
    </UContainer>
  </UApp>
</template>

<style scoped>
@media (min-width: 1024px) {
}
</style>
