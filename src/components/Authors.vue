<script lang="ts" setup>
import {h, ref, resolveComponent, useTemplateRef} from "vue";
import type {TableColumn, TableRow} from "@nuxt/ui";
import type {User} from "@/stores/userStore.ts";

interface UserWithAuthor extends User {
  isAuthor: boolean;
  disabled: boolean;
}

const props = defineProps<{
  users: UserWithAuthor[]
}>()

const emit = defineEmits<{
  submitComplete: [userIds: string[]],
}>()

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UIcon = resolveComponent('UIcon')

const columns: TableColumn<UserWithAuthor>[] = [
  {
    id: 'select',
    cell: ({row}) =>
        h(UCheckbox, {
          modelValue: row.getIsSelected(),
          disabled: row.original.disabled,
          icon: row.original.isAuthor ? "lucide:minus" : "lucide:plus",
          color: row.original.isAuthor ? "error" : "success",
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
          'aria-label': 'Select row'
        })
  },
  {
    accessorKey: 'id',
    header: 'Id',
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
    accessorKey: 'isAuthor',
    header: 'Is Author?',
    cell: ({row}) => h(UIcon, {
      name: row.original.isAuthor ? "lucide:circle-check" : "lucide:circle-x",
      class: ["size-7", row.original.isAuthor ? "is-author-icon" : "is-not-author-icon"],
    })
  },
]
const table = useTemplateRef('table')
const rowSelection = ref<Record<string, boolean>>({})

function onSelect(e: Event, row: TableRow<UserWithAuthor>) {
  /* If you decide to also select the column you can do this  */
  row.toggleSelected(!row.getIsSelected())
}

async function onSubmit() {
  try {
    const selectedIds = Object.keys(rowSelection.value)
        .map(id => Number(id)); // Convert string keys to numbers

    const selectedUsers = selectedIds.map(index => props.users[index])
    const userIds = selectedUsers.map(user => user.id)

    emit('submitComplete', userIds)
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <UForm class="space-y-4" @submit="onSubmit">
    <UTable ref="table" v-model:row-selection="rowSelection" :columns="columns" :data="props.users" class="flex-1"
            @select="onSelect"/>

    <div class="px-4 py-3.5 border-t border-accented text-sm text-muted">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
    </div>

    <UButton type="submit">
      Change authors
    </UButton>
  </UForm>
</template>

<style scoped>
:deep(tr:has(button[disabled])) {
  opacity: 0.5;
  cursor: not-allowed;
}

:deep(.is-author-icon) {
  color: var(--color-success);
}

:deep(.is-not-author-icon) {
  color: var(--color-error);
}
</style>