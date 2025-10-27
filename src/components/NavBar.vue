<script lang="ts" setup>
import type {NavigationMenuItem} from '@nuxt/ui'
import {computed, onMounted, toRef} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.ts";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/userStore.ts";

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore();
const {currentUser} = storeToRefs(userStore);

const toast = useToast();

async function logout() {
  await authStore.logout()
  toast.add({
    title: 'Logged out',
    icon: "lucide:log-out",
    description: `Successfully logged out, see you next time!`,
    color: 'success'
  })
  await router.push({name: 'login'})
}

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/home',
    active: route.path === '/' || route.path.startsWith('/home') || route.path.startsWith('/blogs')
  }, ...(authStore.isLoggedIn ? [
    ...(authStore.isAdmin ? [
      {
        label: 'Users',
        to: '/users',
        active: route.path.startsWith('/users')
      }, {
        label: 'Roles',
        to: '/roles',
        active: route.path.startsWith('/roles')
      },
    ] : []),
    {
      label: 'Create Blog',
      to: '/blog/new',
      active: route.path.startsWith('/blog/new')
    }, {
      label: 'My Blogs',
      to: '/me/blogs',
      active: route.path.startsWith('/me/blogs')
    },
  ] : []),
])

async function profile() {
  await router.push("/profile");
}

onMounted(async () => {
  await userStore.getUser();
})
</script>

<template>
  <UHeader toggle-side="left">
    <template #title>
      <div class="flex flex-row gap-3">
        <UIcon class="text-primary-700 dark:text-primary-200 size-7" name="lucide:home"/>
        <p class="text-primary-700 dark:text-primary-200">Vue Blogger</p>
      </div>
    </template>

    <UNavigationMenu :items="items"/>

    <template #right>
      <UColorModeButton/>

      <UTooltip :kbds="['meta', 'G']" text="Open on GitHub">
        <UButton
            aria-label="GitHub"
            color="neutral"
            icon="lucide:github"
            target="_blank"
            to="https://github.com/Yannick-Vk/vue-blogs"
            variant="ghost"
        />
      </UTooltip>

      <ProfileHeader v-if="authStore.isLoggedIn" :user="currentUser!" @logout="logout" @profile="profile"/>
      <UButton v-else-if="route.path === '/login'" class="w-24" icon="lucide:log-in" to="/register">Register</UButton>
      <UButton v-else class="w-24" icon="lucide:log-in" to="/login">Login</UButton>

    </template>

    <template #body>
      <UNavigationMenu :items="items" class="-mx-2.5" orientation="vertical"/>
    </template>
  </UHeader>
</template>
