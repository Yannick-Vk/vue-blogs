<script setup lang="ts">
import {onMounted} from "vue";
import {useAuthStore} from "@/stores/auth.ts";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";

const route = useRoute();
const provider = route.params.provider as string;

const auth = useAuthStore();
const { user } = storeToRefs(auth);

onMounted(async () => {
  await auth.whoAmI();
})
</script>

<template>
  <h2 class="text-2xl">Login with {{ provider }} successfully!</h2>
  <div v-if="user">
    <p>ID: {{ user.id }}</p>
    <p>Username: {{ user.username }}</p>
    <p>Email: {{ user.email }}</p>
  </div>
  <div v-else class="mt-5">
    <UAlert title="Failed to get user data" color="error"></UAlert>
  </div>
</template>

<style scoped>

</style>