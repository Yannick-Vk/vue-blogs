<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed, h, onMounted, ref, resolveComponent} from "vue";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";
import {storeToRefs} from "pinia";
import {useRoleStore} from "@/stores/roleStore.ts";
import type {TableColumn} from "@nuxt/ui";
import type {Row} from "@tanstack/vue-table";
import type {User} from "@/stores/userStore.ts";

const route = useRoute();
const roleName = route.params.id as string;
const roleStore = useRoleStore();
const {users} = storeToRefs(roleStore);
const userToRemove = ref<User | null>(null);

onMounted(async () => {
  await roleStore.getUsersWithRole(roleName);
})

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const columns: TableColumn<User>[] = [
  {
    accessorKey: 'username',
    header: 'Username',
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
      label: 'Remove user from role',
      async onSelect() {
        open.value = true;
        userToRemove.value = row.original;
      }
    },
  ]
}

const open = ref<boolean>(false);

function _closeModal(): void {
  open.value = false;
}

async function confirmDelete(): void {
  open.value = false;
  if (!userToRemove.value) {
    return;
  }

  //await roleStore.removeUser(userToRemove.value);
  if (!userStore.error) {
    toast.add({
      title: `Removed user ${userToRemove.value.name}`,
      description: `Successfully removed ${userToRemove.value.name} from role ${currentUser.value.username}`,
      color: "success",
      icon: "lucide:trash-2"
    })
  }
}

const items = computed<BreadcrumbItem[]>(() => [
  {
    label: 'Home',
    icon: 'lucide:home',
    to: '/'
  }, {
    label: 'Roles',
    icon: 'lucide:users',
    to: `/roles`
  }, {
    label: `${roleName}`,
    icon: 'lucide:users',
    to: `/roles/${roleName}`
  },

])
</script>

<template>
  <UBreadcrumb :items="items" class="mb-5"/>
  <h2 class="text-2xl text-primary-300">{{ roleName }}</h2>
  <div v-if="users.length > 0">
    <p>This role has {{ users.length }} Users.</p>
    <UTable :data="users" :columns="columns" class="flex-1"/>
    <UModal
        :title="`Removing user '${userToRemove?.username}' from ${roleName}`"
        description="Are you sure you want to remove this user?"
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
    <UAlert title="Role doesn't have any users" color="primary" variant="subtle" class="my-5"/>
  </div>
</template>

<style scoped>

</style>