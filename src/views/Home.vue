<script lang="ts" setup>
import {ref} from "vue";
import {useAuthStore, type User} from "@/stores/auth.ts";

const user = ref<User | null>(useAuthStore().user)

</script>

<template>
  <main>
    <UButton class="my-3">
      <span v-if="user">Welcome {{ user!.username }}!</span>
      <span v-else>Welcome!</span>
    </UButton>

    <blog-list/>
  </main>
</template>
