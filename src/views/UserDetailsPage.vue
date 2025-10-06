<script setup lang="ts">
import {useRoute} from 'vue-router';
import {useUserStore} from "@/stores/userStore.ts";
import {storeToRefs} from "pinia";
import {computed, h, onMounted, ref, resolveComponent} from "vue";
import type {TableColumn} from "@nuxt/ui";
import type {Row} from "@tanstack/vue-table";
import {useRoleStore} from "@/stores/roleStore.ts";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";
import type {Role} from "@/types/Role.ts";

const toast = useToast();

const route = useRoute();
const userId = route.params.id as string;
const userStore = useUserStore();
const {currentUser, roles} = storeToRefs(userStore);

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const open = ref<boolean>(false);
const roleToRemove = ref<Role | null>(null);
const allRoles = ref<string[]>([]);

onMounted(async () => {
  await userStore.fetchUser(userId);
  if (!currentUser.value) {
    console.warn("No user found.");
    return;
  }
  console.dir(currentUser.value);
  const roleStore = useRoleStore();
  await roleStore.fetchAllRoles();
  allRoles.value = roleStore.roles.map((role: Role) => role.name);

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

async function confirmDelete() {
  open.value = false;
  if (!roleToRemove.value) {
    return;
  }

  await userStore.removeRole(roleToRemove.value.name);
  if (!userStore.error) {
    toast.add({
      title: `Removed role ${roleToRemove.value.name}`,
      description: `Successfully removed ${roleToRemove.value.name} from user ${currentUser.value?.username}`,
      color: "success",
      icon: "lucide:trash-2"
    })
  }
}

const selectedRoles = ref<Role[]>([]);

async function addRoles() {
  for (let role of selectedRoles.value) {
    await userStore.addRole(role.name);
  }

  toast.add({
    title: `Successfully added role(s)`,
    description: `Successfully added ${selectedRoles.value.join(", ")} to ${currentUser.value?.username}`,
    color: "success",
    icon: "lucide:circle-check"
  });

}

const items = computed<BreadcrumbItem[]>(() => [
  {
    label: 'Home',
    icon: 'lucide:home',
    to: '/'
  }, {
    label: 'Users',
    icon: 'lucide:users',
    to: `/users`
  }, {
    label: 'Edit',
    icon: 'lucide:user-pen',
    to: `/users/${currentUser.value?.id}`
  },
])
</script>

<template>
  <div class="flex flex-col justify-center">
    <UBreadcrumb :items="items" class="mb-5"/>
    <div v-if="currentUser">
      <div>
        <h1 class="text-2xl">User Details Page</h1>
        <p>User ID: {{ userId }}</p>
        <p>Username: {{ currentUser.username }}</p>
        <p>Email: {{ currentUser.email }}</p>
      </div>
      <div v-if="roles.length > 0">
        <UTable :data="roles" :columns="columns" class="flex-1"/>
      </div>
      <div v-else>
        <UAlert title="User doesn't have any roles" color="primary" variant="subtle" class="my-5"/>
      </div>
      <div>
        <UForm @submit="addRoles" class="mt-5">
          <USelect v-model="selectedRoles" multiple :items="allRoles" class="w-48"/>

          <UButton type="submit" class="ml-5"> Add roles</UButton>
        </UForm>
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