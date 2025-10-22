<script setup lang="ts">
import {onMounted} from "vue";
import {useAuthStore} from "@/stores/auth.ts";
import {useRoute} from "vue-router";
import router from "@/router/routes.ts";

const route = useRoute();
const provider = route.params.provider as string;
const toast = useToast();

const auth = useAuthStore();

onMounted(async () => {
  await auth.whoAmI();
  toast.add({
    title: `Login with ${provider} was successful`,
    icon: `cib:${provider.toLowerCase()}`,
    description: `Successfully logged in with ${provider}.`,
    color: 'success'
  })
  await router.push("/profile");
})
</script>

<template>
</template>