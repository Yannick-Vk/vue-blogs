<script setup lang="ts">
import {useRoute} from 'vue-router';
import {type User, useUserStore} from "@/stores/userStore.ts";
import {storeToRefs} from "pinia";
import {onMounted, ref} from "vue";
import type {TableColumn} from "@nuxt/ui";

const route = useRoute();
const userId = route.params.id as string;
const userStore = useUserStore();
const {currentUser} = storeToRefs(userStore);

onMounted(() => {
  userStore.fetchUser(userId);
});

const data = ref<User[]>([])

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({row}) => row.getValue('id')
  },
  {
    accessorKey: 'email',
    header: 'Email'
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
        <UTable :data="data" :columns="columns" class="flex-1"/>
      </div>
    </div>
    <div v-else>
      Loading user with id {{ userId }} ...
    </div>
  </div>
</template>

<style scoped>
</style>