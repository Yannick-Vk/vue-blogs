<script setup lang="ts">
import {useRoute} from 'vue-router';
import {type Role, type User, useUserStore} from "@/stores/userStore.ts";
import {storeToRefs} from "pinia";
import {h, onMounted, resolveComponent} from "vue";
import type {TableColumn} from "@nuxt/ui";
import type {Row} from "@tanstack/vue-table";

const route = useRoute();
const userId = route.params.id as string;
const userStore = useUserStore();
const {currentUser, roles} = storeToRefs(userStore);

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

onMounted(async () => {
  await userStore.fetchUser(userId);
  if (!currentUser.value) {
    console.warn("No user found.");
    return;
  }
  await userStore.getRoles(currentUser.value.username);
});


const columns: TableColumn<Role>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'actions',
    cell: ({row}) => {
      return h(
          'div',
          {class: 'text-right'},
          h(
              UDropdownMenu,
              {
                content: {
                  align: 'end'
                },
                items: getRowItems(row),
                'aria-label': 'Actions dropdown'
              },
              () =>
                  h(UButton, {
                    icon: 'i-lucide-ellipsis-vertical',
                    color: 'neutral',
                    variant: 'ghost',
                    class: 'ml-auto',
                    'aria-label': 'Actions dropdown'
                  })
          )
      )
    }
  },
]

function getRowItems(row: Row<User>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Remove role from user',
      async onSelect() {
        console.log("Removing role from user!");
      }
    },
  ]
}
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
        <UTable :data="roles" :columns="columns" class="flex-1"/>
      </div>
    </div>
    <div v-else>
      Loading user with id {{ userId }} ...
    </div>
  </div>
</template>

<style scoped>
</style>