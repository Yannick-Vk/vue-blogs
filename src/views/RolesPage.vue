<script lang="ts" setup>
import {computed, defineComponent, h, onMounted, ref, resolveComponent, watch} from "vue";
import {useRoleStore} from '../stores/roleStore.ts'
import type {User} from "@/stores/userStore.ts";
import {useUserStore} from "@/stores/userStore.ts";
import {storeToRefs} from "pinia";
import type {SelectMenuItem, TableColumn} from "@nuxt/ui";
import type {Role} from "@/types/Role.ts";
import type {Row} from "@tanstack/vue-table";
import router from "@/router/routes.ts";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";
import AddRoleForm from "@/components/AddRoleForm.vue";
import {useProfileStore} from "@/stores/profileStore.ts";

const toast = useToast();
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const roleStore = useRoleStore();
const userStore = useUserStore();
const profileStore = useProfileStore();
const {roles} = storeToRefs(roleStore);
const {users} = storeToRefs(userStore);

const roleName = ref<string>("");
const usersWithAvatars = ref<any[]>([]);

onMounted(async () => {
  await roleStore.fetchAllRoles();
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
      icon: 'lucide:users',
      async onSelect() {
        await router.push(`/roles/${row.original.name}`);
      },
    }, {
      label: 'Add user',
      icon: 'lucide:user-plus',
      async onSelect() {
        roleName.value = row.original.name;
        openAddUserModal.value = true;
      },
    },
    {
      label: 'Remove Role',
      color: 'error',
      icon: 'lucide:trash-2',
      async onSelect() {
        roleName.value = row.original.name;
        openDeleteUserModal.value = true;
      },
    },
  ]
}

const openAddUserModal = ref<boolean>(false);
const openDeleteUserModal = ref<boolean>(false);
const usersWithCurrentRole = ref<User[]>([]);

watch(roleName, async (newRoleName) => {
  if (newRoleName) {
    usersWithCurrentRole.value = await roleStore.getUsersWithRole(newRoleName) || [];
  }
}, {immediate: true});

function _closeAddUserModal(): void {
  openAddUserModal.value = false;
}

async function _confirmAddUserModal() {
  if (!selectedUserObject.value) return;

  openAddUserModal.value = false;
  await roleStore.addRoleToUser(selectedUserObject.value.label, roleName.value);
  await roleStore.fetchAllRoles();
  await userStore.fetchUsers();
  usersWithCurrentRole.value = await roleStore.getUsersWithRole(roleName.value) || [];

  toast.add({
    title: `Added ${selectedUserObject.value.label} to the ${roleName.value}`,
    description: `Successfully added user ${selectedUserObject.value.label} to the role ${roleName.value}`,
    icon: "lucide:circle-check",
    color: 'success'
  })

  selectedUser.value = undefined; // Reset after a user has been added
}

function _closeDeleteUserModal(): void {
  openDeleteUserModal.value = false;
}

async function _confirmDeleteUserModal() {
  openDeleteUserModal.value = false;
  console.log("removing role", roleName.value);
  await roleStore.removeRole(roleName.value);
  await roleStore.fetchAllRoles();
}

const userItems = computed(() => usersWithAvatars.value
    .filter((user) => !usersWithCurrentRole.value.some(u => u.id === user.id))
    .map((user) => {
      return {
        label: user.username,
        value: user.id,
        avatar: user.avatar
      }
    }).sort((a, b) => a.label.localeCompare(b.label)));

const selectedUser = ref<string | number | undefined>(undefined)

const selectedUserObject = computed(() => {
  return userItems.value.find(item => item.value === selectedUser.value);
});

const searchTerm = ref<string>("");

const filteredRoles = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (term.length < 1) {
    return roles.value;
  }
  return roles.value.filter((role) => role.name.toLowerCase().includes(term));
});

const error = ref<string | null>(null);

async function createRole(roleName: string) {
  try {
    error.value = null;

    await roleStore.createRole(roleName);
    await roleStore.fetchAllRoles();

    toast.add({
      title: `Successfully created ${roleName}`,
      description: `Creation of Role ${roleName} was successful`,
      color: 'success',
      icon: "lucide:user-plus",
    })
  } catch (er) {
    error.value = "Failed to create role";
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
  },
])
</script>

<template>
  <UBreadcrumb :items="items" class="mb-5"/>
  <div v-if="roles.length > 0">
    <UCard class="my-3 flex flex-row gap-3 justify-center" color="primary" variant="subtle">
      <AddRoleForm @submit="createRole"/>
    </UCard>
    <UCard class="my-3 flex flex-row gap-3 justify-center" color="primary" variant="subtle">
      <SearchBox v-model:search-term="searchTerm" class="w-96" title="Search roles..."/>

    </UCard>
    <div v-if="filteredRoles.length > 0">
      <UTable :columns="columns" :data="filteredRoles"/>

      <UModal
          v-model:open="openAddUserModal"
          :description="`Select a user to add to ${roleName?? ``}`"
          title="Adding user"
      >
        <template #body>
          <USelectMenu v-model="selectedUser" :avatar="selectedUserObject?.avatar" :items="userItems" class="w-full"
                       placeholder="Select a user"/>
        </template>
        <template #footer>
          <div class="flex items-center justify-start gap-3">
            <UButton color="neutral" @click="_closeAddUserModal">Cancel</UButton>
            <UButton color="success" @click="_confirmAddUserModal">Confirm</UButton>
          </div>
        </template>
      </UModal>
      <UModal
          v-model:open="openDeleteUserModal"
          :description="`Are you sure you want to remove role '${roleName?? ''}'`"
          :title="`Removing role ${roleName?? ''}`"
      >
        <template #footer>
          <div class="flex items-center justify-start gap-3">
            <UButton color="neutral" @click="_closeDeleteUserModal">Cancel</UButton>
            <UButton color="error" @click="_confirmDeleteUserModal">Confirm deletion</UButton>
          </div>
        </template>
      </UModal>
    </div>
    <div v-else>
      <UCard variant="subtle">
        <h2 class="text-2xl text-primary mb-5">No results</h2>
        <p>No roles found matching your search term.</p>
      </UCard>
    </div>
  </div>
  <div v-else>
    <UAlert class="my-5" color="error" title="No roles have been loaded" variant="subtle"/>
  </div>
</template>

<style scoped>

</style>