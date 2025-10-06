<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";

const authStore = useAuthStore();
const user = authStore.user;
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Profile</h2>
    <div v-if="user">
      <UUser

          :name="user.username"
          :description="user.email"
          :avatar="{
          src: `https://i.pravatar.cc/64?u=${user.username}`,
        }"
          size="3xl"
      />

    </div>

    <div v-else>
      <p>Loading user profile...</p>
    </div>
  </div>
</template>

<style scoped>

</style>