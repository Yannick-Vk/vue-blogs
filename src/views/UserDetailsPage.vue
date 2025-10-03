<script setup lang="ts">
import {useRoute} from 'vue-router';
import {type Role, useUserStore} from "@/stores/userStore.ts";
import {storeToRefs} from "pinia";
import {h, onMounted, ref, resolveComponent} from "vue";
import type {TableColumn} from "@nuxt/ui";
import type {Row} from "@tanstack/vue-table";

const toast = useToast();

const route = useRoute();
const userId = route.params.id as string;
const userStore = useUserStore();
const {currentUser, roles} = storeToRefs(userStore);

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const open = ref<boolean>(false);
const roleToRemove = ref<Role | null>(null);

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

function getRowItems(row: Row<Role>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Remove role from user',
      async onSelect() {
        open.value = !open.value;
        roleToRemove.value = row.original;
      }
    },
  ]
}

function _closeModal(): void {
  open.value = false;
}

async function confirmDelete(): void {
  open.value = false;
  if (!roleToRemove.value) {
    return;
  }

  await userStore.removeRole(roleToRemove.value.name);
  if (!userStore.error) {
    toast.add({
      title: `Removed role ${roleToRemove.value.name}`,
      description: `Successfully removed ${roleToRemove.value.name} from user ${currentUser.value.username}`,
      color: "success",
      icon: "lucide:trash-2"
    })
  }
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

      <UModal
          :title="`Removing role '${roleToRemove?.name}' from ${currentUser.username}`"
          description="Are you sure you want to remove this role?"
          v-model:open="open"
      >
        <template #body>
          <div class="flex items-center justify-start gap-3">
            <UButton color="neutral" @click="_closeModal">Cancel</UButton>
            <UButton color="error" @click="confirmDelete">Remove</UButton>
          </div>
        </template>
      </UModal>
    </div>
    <div v-else>
      Loading user with id {{ userId }} ...
    </div>
  </div>
</template>

<style scoped>
</style>