<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useAuthStore} from "@/stores/auth.ts";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/userStore.ts";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";


const {user} = storeToRefs(useAuthStore());
const userStore = useUserStore();
const {users, error} = storeToRefs(userStore);

onMounted(() => {
  userStore.fetchUsers();
});

const items = computed<BreadcrumbItem[]>(() => [
  {
    label: 'Home',
    icon: 'lucide:home',
    to: '/'
  }, {
    label: 'Users',
    icon: 'lucide:users',
    to: `/users`
  },
])
</script>

<template>
  <UBreadcrumb :items="items" class="mb-5"/>
  <h1 class="text-3xl color-primary-700 my-5">Users</h1>
  <UsersTable :is-loading="false" :data="users"/>
</template>

<style scoped>

</style>