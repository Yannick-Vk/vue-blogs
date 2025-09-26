<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useAuthStore, type User} from "@/stores/auth.ts";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/userStore.ts";


const {user} = storeToRefs(useAuthStore());
const userStore = useUserStore();
const {users, error} = storeToRefs(userStore);

onMounted(() => {
  userStore.fetchUsers();
});

</script>

<template>
  <h1 class="text-3xl color-primary-700 my-5">Users</h1>
  <UsersTable :is-loading="false" :data="users"/>
</template>

<style scoped>

</style>