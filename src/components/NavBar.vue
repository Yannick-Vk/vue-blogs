<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import {computed} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/home',
    active: route.path.startsWith('/home')
  },
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
            to="https://github.com/nuxt/ui"
            target="_blank"
            icon="lucide:github"
            aria-label="GitHub"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>
