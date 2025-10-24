<script lang="ts" setup>
import {useRoute} from "vue-router";
import {computed, h, onMounted, ref, resolveComponent} from "vue";
import type {BreadcrumbItem} from "@nuxt/ui/components/Breadcrumb.vue";
import {useRoleStore} from "@/stores/roleStore.ts";
import type {TableColumn} from "@nuxt/ui";
import type {Row} from "@tanstack/vue-table";
import type {User} from "@/stores/userStore.ts";
import {useProfileStore} from "@/stores/profileStore.ts";
import router from "@/router/routes.ts";
import {useClipboard} from "@vueuse/core";

const toast = useToast();
const route = useRoute();
const roleName = route.params.id as string;
const roleStore = useRoleStore();
const profileStore = useProfileStore();
const users = ref<any[]>([]);
const userToRemove = ref<User | null>(null);
const {copy} = useClipboard();

onMounted(async () => {
  const userList: User[] = await roleStore.getUsersWithRole(roleName);
  const usersWithAvatars = await Promise.all(
      userList.map(async (user) => {
        const avatarSrc = await profileStore.getProfilePicture(user.id);
        return {
          ...user,
          avatarSrc: avatarSrc || `https://i.pravatar.cc/64?u=${user.username}`
        };
      })
  );
  users.value = usersWithAvatars.sort((a, b) => a.username.localeCompare(b.username));
})

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UAvatar = resolveComponent('UAvatar')
const columns: TableColumn<any>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({row}) => {
      return h(UAvatar, {
        src: row.original.avatarSrc,
      });
    }
  },
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

function getRowItems(row: Row<any>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy user Id',
      icon: 'lucide:clipboard-copy',
      onSelect() {
        copy(row.original.id)

        toast.add({
          title: 'User ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        })
      },
    },
    {
      label: 'See user details',
      icon: 'lucide:user-cog',
      async onSelect() {
        await router.push({ name: 'users', params: {id: row.original.id} });
      },
    },
    {
      label: 'Remove user from role',
      color: 'error',
      icon: 'lucide:trash-2',
      async onSelect() {
        open.value = true;
        userToRemove.value = row.original;
      },
    },
  ]
}

const open = ref<boolean>(false);

function _closeModal(): void {
  open.value = false;
}

async function confirmDelete() {
  open.value = false;
  if (!userToRemove.value) {
    return;
  }

  await roleStore.removeRoleFromUser(userToRemove.value.username, roleName);
  const userList: User[] = await roleStore.getUsersWithRole(roleName);
  const usersWithAvatars = await Promise.all(
      userList.map(async (user) => {
        const avatarSrc = await profileStore.getProfilePicture(user.id);
        return {
          ...user,
          avatarSrc: avatarSrc || `https://i.pravatar.cc/64?u=${user.username}`
        };
      })
  );
  users.value = usersWithAvatars.sort((a, b) => a.username.localeCompare(b.username));
  toast.add({
    title: `Removed user ${userToRemove.value.username}`,
    description: `Successfully removed ${userToRemove.value.username} from role ${roleName}`,
    color: "success",
    icon: "lucide:trash-2"
  })

}

const searchTerm = ref<string>("");

const filteredUsers = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (term.length < 1) {
    return users.value;
  }
  return users.value.filter((user) => user.username.toLowerCase().includes(term));
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
  }, {
    label: `${roleName}`,
    icon: 'lucide:users',
    to: `/roles/${roleName}`
  },

])
</script>

<template>
  <UBreadcrumb :items="items" class="mb-5"/>
  <h2 class="text-2xl text-primary">{{ roleName }}</h2>
  <div v-if="users.length > 0">
    <p>This role has {{ users.length }} Users.</p>
    <UCard class="my-3 flex flex-row gap-3 justify-center" color="primary" variant="subtle">
      <SearchBox v-model:search-term="searchTerm" class="w-96" title="Search users..."/>
    </UCard>
    <div v-if="filteredUsers.length > 0">
      <UTable :columns="columns" :data="filteredUsers" class="flex-1"/>
      <UModal
          v-model:open="open"
          :title="`Removing user '${userToRemove?.username}' from ${roleName}`"
          description="Are you sure you want to remove this user?"
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
      <UCard variant="subtle">
        <h2 class="text-2xl text-primary mb-5">No results</h2>
        <p>No users found matching your search term.</p>
      </UCard>
    </div>
  </div>
  <div v-else>
    <UAlert class="my-5" color="primary" title="Role doesn't have any users" variant="subtle"/>
  </div>
</template>

<style scoped>

</style>