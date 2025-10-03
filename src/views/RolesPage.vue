<script setup lang="ts">
import {computed, defineComponent, h, onMounted, ref, resolveComponent, watch} from "vue";
import {useRoleStore} from '../stores/roleStore.ts'
import type {User} from "@/stores/userStore.ts";
import {useUserStore} from "@/stores/userStore.ts";
import {storeToRefs} from "pinia";
import type {TableColumn} from "@nuxt/ui";
import type {Role} from "@/types/Role.ts";
import type {Row} from "@tanstack/vue-table";
import router from "@/router/routes.ts";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const roleStore = useRoleStore();
const userStore = useUserStore();
const {roles} = storeToRefs(roleStore);
const {users} = storeToRefs(userStore);

const roleName = ref<string>("");

onMounted(async () => {
  await roleStore.fetchAllRoles();
  await userStore.fetchUsers();
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
    const {roles} = storeToRefs(roleStore); // Get roles from store to watch it

    const fetchCount = async () => {
      isLoading.value = true;
      try {
        const roleUsers = await roleStore.getUsersWithRole(props.roleName);
        count.value = roleUsers?.length || 0;
      } catch (e) {
        console.error(`Failed to get user count for role ${props.roleName}`, e);
        count.value = 0;
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(fetchCount);

    // Watch for changes in the global roles array to re-fetch the count
    watch(roles, () => {
      fetchCount();
    }, {deep: true}); // deep: true might be needed if the content of roles changes, not just the array reference

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
      }
    },
  ]
}

const open = ref<boolean>(false);
const usersWithCurrentRole = ref<User[]>([]);

watch(roleName, async (newRoleName) => {
  if (newRoleName) {
    usersWithCurrentRole.value = await roleStore.getUsersWithRole(newRoleName) || [];
  }
}, { immediate: true });

function _closeModal(): void {
  open.value = false;
}

async function _confirmModal(): void {
  open.value = false;
  await roleStore.addRoleToUser(selectedUser.value.label, roleName.value);
  await roleStore.fetchAllRoles();
  await userStore.fetchUsers();
  usersWithCurrentRole.value = await roleStore.getUsersWithRole(roleName.value) || [];
  selectedUser.value = null; // Reset after an user has been added
}

const userItems = computed(() => users.value
  .filter((user: User) => !usersWithCurrentRole.value.some(u => u.id === user.id))
  .map((user: User) => {
  return {
    label: user.username,
    value: user.id,
    avatar: {
      src: `https://i.pravatar.cc/64?u=${user.username}`,
    }
  }
}).sort((a, b) => a.label.localeCompare(b.label)));

const selectedUser = ref(null)

const selectedUserObject = computed(() => {
  return userItems.value.find(item => item.value === selectedUser.value);
});

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
        title="Adding user"
        :description="`Select a user to add to ${roleName?? ``}`"
        v-model:open="open"
    >
      <template #body>
        <USelectMenu v-model="selectedUser" :avatar="selectedUserObject?.avatar" :items="userItems" class="w-full"
                     placeholder="Select a user"/>
      </template>
      <template #footer>
        <div class="flex items-center justify-start gap-3">
          <UButton color="neutral" @click="_closeModal">Cancel</UButton>
          <UButton color="success" @click="_confirmModal">Confirm</UButton>
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