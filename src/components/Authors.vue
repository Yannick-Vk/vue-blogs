<script setup lang="ts">
import {h, reactive, resolveComponent} from "vue";
import * as z from "zod";
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

const schema = z.object({
  user: z.string("Please select a user to add as authors"),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  user: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const user = event.data.user;
    toast.add({title: 'Success', description: `Added ${user} to authors`, color: 'success'});
  } catch (err) {

  }
}

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

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
  },
]

</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UTable :data="props.users" :columns="columns" class="flex-1"/>
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
</style>