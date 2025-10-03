<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed, onMounted} from "vue";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";
import {storeToRefs} from "pinia";
import {useRoleStore} from "@/stores/roleStore.ts";

const route = useRoute();
const roleName = route.params.id as string;
const roleStore = useRoleStore();
const {users} = storeToRefs(roleStore);

onMounted(async () => {
  await roleStore.getUsersWithRole(roleName);
})

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
  <p>This role has {{users.length}} Users.</p>
</template>

<style scoped>

</style>