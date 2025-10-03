<script setup lang="ts">
import {h, onMounted, ref, resolveComponent} from "vue";
import {useRoleStore} from '../stores/roleStore.ts'
import {storeToRefs} from "pinia";
import type {TableColumn} from "@nuxt/ui";
import type {Role} from "@/types/Role.ts";
import type {Row} from "@tanstack/vue-table";

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const roleStore = useRoleStore();
const {roles} = storeToRefs(roleStore);

onMounted(async () => {
  await roleStore.fetchAllRoles();
})

const columns: TableColumn<Role>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
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

      }
    },
  ]
}

</script>

<template>
  <div v-if="roles.length > 0">
    <UTable :columns="columns" :data="roles"/>
  </div>
  <div v-else>
    <UAlert title="No roles have been loaded" variant="subtle" color="error" class="my-5"/>
  </div>
</template>

<style scoped>

</style>