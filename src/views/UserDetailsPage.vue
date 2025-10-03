<script setup lang="ts">
import {useRoute} from 'vue-router';
import {type Role, useUserStore} from "@/stores/userStore.ts";
import {storeToRefs} from "pinia";
import {onMounted, ref} from "vue";
import type {TableColumn} from "@nuxt/ui";

const route = useRoute();
const userId = route.params.id as string;
const userStore = useUserStore();
const {currentUser, roles} = storeToRefs(userStore);

onMounted(async () => {
  await userStore.fetchUser(userId);
  if (!currentUser.value) {
    console.warn("No user found.");
    return;
  }
  await userStore.getRoles(currentUser.value.username);
});


const columns: TableColumn<Role>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
]

</script>

<template>
  <div class="flex flex-col justify-center">
    <div v-if="currentUser">
      <div>
        <h1 class="text-2xl">User Details Page</h1>
        <p>User ID: {{ userId }}</p>
        <p>Username: {{ currentUser.username }}</p>
        <p>Email: {{ currentUser.email }}</p>
      </div>
      <div>
        <UTable :data="roles" :columns="columns" class="flex-1"/>
      </div>
    </div>
    <div v-else>
      Loading user with id {{ userId }} ...
    </div>
  </div>
</template>

<style scoped>
</style>