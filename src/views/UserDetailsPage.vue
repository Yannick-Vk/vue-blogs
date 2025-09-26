<script setup lang="ts">
import { useRoute } from 'vue-router';
import {useUserStore} from "@/stores/userStore.ts";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";

const route = useRoute();
const userId = route.params.id as string;
const userStore = useUserStore();
const {currentUser} = storeToRefs(userStore);

onMounted(() => {
  userStore.fetchUser(userId);
});

</script>

<template>
  <div v-if="currentUser">
    <h1>User Details Page</h1>
    <p>User ID: {{ userId }}</p>
    <p>Username: {{currentUser.username}}</p>
    <p>Email: {{currentUser.email}}</p>
  </div>
  <div v-else>
    Loading user with id {{userId}} ...
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh; /* Full viewport height */
  text-align: center;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

p {
  font-size: 1.5em;
}
</style>