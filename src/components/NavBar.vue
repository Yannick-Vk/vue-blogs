<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'
import {computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.ts";

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const toast = useToast()

async function logout() {
  await authStore.logout()
  toast.add({
    title: 'Logged out',
    icon: "lucide:log-out",
    description: `Successfully logged out, see you next time!`,
    color: 'success'
  })
  await router.push({name: 'login'})
}

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/home',
    active: route.path === '/' || route.path.startsWith('/home') || route.path.startsWith('/blog')
  }, {
    label: 'Users',
    to: '/users',
    active: route.path.startsWith('/users')
  }, {
    label: 'Roles',
    to: '/roles',
    active: route.path.startsWith('/roles')
  },
])
</script>

<template>
  <UHeader toggle-side="left">
    <template #title>
      <div class="flex flex-row gap-3">
        <UIcon name="lucide:home" class="text-primary-700 dark:text-primary-200 size-7" />
        <p class="text-primary-700 dark:text-primary-200">Vue Blogger</p>
      </div>
    </template>

    <UNavigationMenu :items="items"/>

    <template #right>
      <UColorModeButton/>

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

      <UButton v-if="authStore.isLoggedIn" @click="logout" icon="lucide:log-out">Logout</UButton>
      <UButton v-else-if="route.path === '/login'" to="/register" icon="lucide:log-in" class="w-24">Register</UButton>
      <UButton v-else to="/login" icon="lucide:log-in" class="w-24">Login</UButton>

    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>
