<script setup lang="ts">
import {computed, defineComponent, h, onMounted, ref, resolveComponent} from "vue";
import {useRoleStore} from '../stores/roleStore.ts'
import {storeToRefs} from "pinia";
import type {SelectMenuItem, TableColumn} from "@nuxt/ui";
import type {Role} from "@/types/Role.ts";
import type {Row} from "@tanstack/vue-table";
import router from "@/router/routes.ts";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";
import type {User} from "@/stores/userStore.ts";

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const roleStore = useRoleStore();
const {roles, users} = storeToRefs(roleStore);

const roleName = ref<string>("");

onMounted(async () => {
  await roleStore.fetchAllRoles();
})

/**
 * This component fetches and displays the number of users for a given role.
 * It's designed for use in a list where each instance is independent.
 * IMPORTANT: This requires your `roleStore.getUsersWithRole` action to be modified
 * to `return` the array of users instead of updating a shared state property.
 * For example: `async getUsersWithRole(roleName) { const users = await ...; return users; }`
 */
const RoleUserCount = defineComponent({
  props: {
    roleName: {type: String, required: true}
  },
  setup(props) {
    const count = ref(0);
    const isLoading = ref(true);
    const roleStore = useRoleStore();

    onMounted(async () => {
      try {
        await roleStore.getUsersWithRole(props.roleName);
        count.value = users.value?.length || 0;
      } catch (e) {
        console.error(`Failed to get user count for role ${props.roleName}`, e);
        count.value = 0;
      } finally {
        isLoading.value = false;
      }
    });

    return () => isLoading.value ? '...' : `${count.value} users`;
  }
})

const columns: TableColumn<Role>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  }, {
    accessorKey: 'count',
    header: 'Amount of users',
    cell: ({row}) => {
      return h(RoleUserCount, {roleName: row.original.name});
    }
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
];

function getRowItems(row: Row<Role>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'See users',
      async onSelect() {
        await router.push(`/roles/${row.original.name}`);
      }
    }, {
      label: 'Add user',
      async onSelect() {
        open.value = true;
        roleName.value = row.original.name;
        console.log("Adding new user to role", roleName.value);
      }
    },
  ]
}

const open = ref<boolean>(false);

function _closeModal(): void {
  open.value = false;
}

async function _confirmModal(): void {
  open.value = false;
  console.log("Chose user", selectedUser.value)
}

const userItems = users.value.map((user: User) => {
  return {
    label: user.username,
    value: user.id,
    avatar: {
      src: `https://i.pravatar.cc/32?u=${user.username}`,
    }
  }
}) satisfies SelectMenuItem[];

const selectedUser = ref(null)

const items = computed<BreadcrumbItem[]>(() => [
  {
    label: 'Home',
    icon: 'lucide:home',
    to: '/'
  }, {
    label: 'Roles',
    icon: 'lucide:users',
    to: `/roles`
  },
])
</script>

<template>
  <UBreadcrumb :items="items" class="mb-5"/>
  <div v-if="roles.length > 0">
    <UTable :columns="columns" :data="roles"/>

    <UModal
        v-model:open="open"
    >
      <template #header>
        Please select a user to add to {{ roleName }}
      </template>
      <template #body>
        <USelectMenu v-model="selectedUser" :avatar="value?.avatar" :items="userItems" class="w-48"/>
      </template>
      <template #footer>
        <div class="flex items-center justify-start gap-3">
          <UButton color="neutral" @click="_closeModal">Cancel</UButton>
          <UButton color="error" @click="_confirmModal">Confirm</UButton>
        </div>
      </template>
    </UModal>
  </div>
  <div v-else>
    <UAlert title="No roles have been loaded" variant="subtle" color="error" class="my-5"/>
  </div>
</template>

<style scoped>

</style>