<script setup lang="ts">
import {reactive, resolveComponent} from "vue";
import * as z from "zod";
import type {FormSubmitEvent, TableColumn} from "@nuxt/ui";
import type {User} from "@/stores/userStore.ts";

const toast = useToast();

const props = defineProps({
  users: Array<User>,
})

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
    accessorKey: 'remove',
    header: 'Remove',
  },
]

</script>

<template>
  <UTable :data="props.users" :columns="columns" class="flex-1"/>

  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="User" name="user">
      <UInputMenu v-model="state.user" placeholder="Select a user" :items="props.users.map(user => user.username)"/>
    </UFormField>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>

<style scoped>

</style>