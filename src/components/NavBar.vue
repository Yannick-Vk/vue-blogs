<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.ts";

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

async function logout() {
  await authStore.logout()
  await router.push({name: 'login'})
}

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/home',
    active: route.path === '/' || route.path.startsWith('/home')
  }
])
</script>

<template>
  <UHeader>
    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
            color="neutral"
            variant="ghost"
            to="https://github.com/Yannick-Vk/vue-blogs"
            target="_blank"
            icon="lucide:github"
            aria-label="GitHub"
        />
      </UTooltip>

      <UButton v-if="!authStore.isLoggedIn" to="/login">Login</UButton>
      <UButton v-else @click="logout">Logout</UButton>
    </template>
  </UHeader>
</template>
