<script setup lang="ts">
import type {DropdownMenuItem} from '@nuxt/ui'
import type {User} from '../stores/auth.ts'

interface Props {
  user: User;
}

const emit = defineEmits(['logout', 'profile']);
const props = defineProps<Props>();

const items: DropdownMenuItem[][] = [
  [
    {
      label: `${props?.user.username}`,
      avatar: {
        src: `https://i.pravatar.cc/64?u=${props?.user.username}`
      },
      type: 'label'
    }
  ],
  [
    {
      label: "Profile",
      icon: 'lucide:user',
      onSelect: async() => {
        emit('profile')
      },
    }
  ],
  [
    {
      label: 'Logout',
      color: 'error',
      icon: 'lucide:log-out',
      onSelect: () => {
        emit('logout')
      }
    }
  ]
]
</script>

<template>
  <UDropdownMenu arrow :items="items" :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 8
    }" :ui="{ content: 'w-48' }">
    <UButton :label="props?.user.username" color="neutral" variant="outline" icon="lucide:user" size="lg"/>
  </UDropdownMenu>
</template>

