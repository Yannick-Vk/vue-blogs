<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed} from "vue";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";

const route = useRoute();
const roleName = route.params.id as string;


const items = computed<BreadcrumbItem[]>(() => [
  {
    label: 'Home',
    icon: 'lucide:home',
    to: '/'
  }, {
    label: 'Roles',
    icon: 'lucide:users',
    to: `/roles`
  }, {
    label: `${roleName}`,
    icon: 'lucide:users',
    to: `/roles/${roleName}`
  },

])
</script>

<template>
  <UBreadcrumb :items="items" class="mb-5"/>
  <h2 class="text-2xl text-primary-300">{{ roleName }}</h2>
</template>

<style scoped>

</style>