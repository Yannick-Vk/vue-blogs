<script setup lang="ts">

import type {TableColumn} from "@nuxt/ui";
import {h, resolveComponent} from "vue";
import type {User} from "@/stores/userStore.ts";
import {useClipboard} from '@vueuse/core'
import type {Row} from '@tanstack/vue-table'
import { useRouter } from 'vue-router';

const props = defineProps({
  isLoading: Boolean,
  data: Array,
});

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const {copy} = useClipboard()
const router = useRouter()

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({row}) => row.getValue('id')
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
      onSelect() {
        copy(row.original.id)

        toast.add({
          title: 'User ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        })
      }
    },
    {
      type: 'separator',
    },
    {
      label: 'View user details',
      async onSelect() {
        await router.push(`/users/${row.original.id}`)
      }
    },
  ]
}
</script>

<template>
  <UTable :loading="isLoading" sticky loading-color="primary" loading-animation="carousel" :data="data" :columns="columns"
          class="flex-1 max-h-[70vh]"/>
</template>
