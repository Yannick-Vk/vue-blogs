<script lang="ts" setup>
import {ref} from "vue";
import {useAuthStore, type User} from "@/stores/auth.ts";

const user = ref<User | null>(useAuthStore().user)

</script>

<template>
  <main>
    <UButton>Welcome {{user?? ""}}!</UButton>
  </main>
</template>
