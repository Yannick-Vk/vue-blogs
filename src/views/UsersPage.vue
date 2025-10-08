<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useAuthStore} from "@/stores/auth.ts";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/userStore.ts";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";
import {useProfileStore} from "@/stores/profileStore.ts";
import {UserWithAvatar} from "../components/UsersTable.vue"

const {user} = storeToRefs(useAuthStore());
const userStore = useUserStore();
const {users, error} = storeToRefs(userStore);
const profileStore = useProfileStore();

const usersWithAvatars = ref<UserWithAvatar[]>([]);

onMounted(async () => {
  await userStore.fetchUsers();
  usersWithAvatars.value = await Promise.all(
      users.value.map(async (user) => {
        const avatarSrc = await profileStore.getProfilePicture(user.id);
        return {
          ...user,
          avatar: {
            src: avatarSrc || `https://i.pravatar.cc/64?u=${user.username}`
          }
        };
      })
  );
});

const searchTerm = ref<string>("");

const filteredUsers = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (term.length < 1) {
    return usersWithAvatars.value;
  }
  return usersWithAvatars.value.filter((user) => user.username.toLowerCase().includes(term));
});

const items = computed<BreadcrumbItem[]>(() => [
  {
    label: 'Home',
    icon: 'lucide:home',
    to: '/'
  }, {
    label: 'Users',
    icon: 'lucide:users',
    to: `/users`
  },
])
</script>

<template>
  <UBreadcrumb :items="items" class="mb-5"/>
  <h1 class="text-3xl color-primary-700 my-5">Users</h1>
  <UCard variant="subtle" color="primary" class="my-3 flex flex-row gap-3 justify-center">
    <SearchBox v-model:search-term="searchTerm" title="Search roles..." class="w-96"/>
  </UCard>
  <div v-if="filteredUsers.length > 0">
    <UsersTable :is-loading="false" :data="filteredUsers"/>
  </div>
  <div v-else>
    <UCard variant="subtle">
      <h2 class="text-2xl text-primary mb-5">No results</h2>
      <p>No users found matching your search term.</p>
    </UCard>
  </div>
</template>

<style scoped>

</style>