<script setup lang="ts">
import {h, resolveComponent, useTemplateRef} from "vue";
import type {FormSubmitEvent, TableColumn} from "@nuxt/ui";
import type {User} from "@/stores/userStore.ts";

const toast = useToast();

interface UserWithAuthor extends User {
  isAuthor: boolean;
  disabled: boolean;
}

const props = defineProps<{
  users?: UserWithAuthor[]
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

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.table(table?.tableApi?.getFilteredSelectedRowModel())
  try {

  } catch (err) {

  }
}
</script>

<template>
  <UForm class="space-y-4" @submit="onSubmit">
    <UTable ref="table" :data="props.users" :columns="columns" class="flex-1"/>

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