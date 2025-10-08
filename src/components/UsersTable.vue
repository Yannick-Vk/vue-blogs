<script lang="ts" setup>

import type {TableColumn} from "@nuxt/ui";
import {h, resolveComponent} from "vue";
import type {User} from "@/stores/userStore.ts";
import {useClipboard} from '@vueuse/core'
import type {Row} from '@tanstack/vue-table'
import {useRouter} from 'vue-router';

const props = defineProps({
  isLoading: Boolean,
  data: Array,
});

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const {copy} = useClipboard()
const router = useRouter()

const UAvatar = resolveComponent('UAvatar')

export interface UserWithAvatar extends User {
  avatar: {
    src: string;
  }
}

const columns: TableColumn<UserWithAvatar>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({row}) => row.getValue('id')
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({row}) => {
      return h(UAvatar, {
        src: row.original.avatar.src,
      });
    }
  },
  {
    accessorKey: 'username',
    header: 'Username'
  },
  {
    accessorKey: 'email',
    header: 'Email'
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
  }
]

function getRowItems(row: Row<User>) {
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
      type: 'separator',
    },
    {
      label: 'View user details',
      icon: "lucide:user-round-cog",
      async onSelect() {
        await router.push(`/users/${row.original.id}`)
      },
    },
  ]
}
</script>

<template>
  <UTable :columns="columns" :data="data" :loading="isLoading" class="flex-1 max-h-[70vh]" loading-animation="carousel"
          loading-color="primary"
          sticky/>
</template>
