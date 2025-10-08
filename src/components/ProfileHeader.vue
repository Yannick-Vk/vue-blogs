<script setup lang="ts">
import type {DropdownMenuItem} from '@nuxt/ui'
import type {User} from '../stores/auth.ts'
import {useProfileStore} from "@/stores/profileStore.ts";
import {computed, onMounted, ref} from "vue";

interface Props {
  user: User;
}

const emit = defineEmits(['logout', 'profile']);
const props = defineProps<Props>();

const profileStore = useProfileStore();
const profilePictureUrl = ref<string | null>(null);

async function fetchAvatar() {
  if (props.user) {
    profilePictureUrl.value = await profileStore.getProfilePicture(props.user.id);
  }
}

onMounted(async () => {
  await fetchAvatar();
});

profileStore.$onAction(({name, after}) => {
  if (name === 'changeProfilePicture') {
    after(async () => {
      await fetchAvatar();
    });
  }
});

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: `${props?.user.username}`,
      avatar: {
        src: profilePictureUrl.value || `https://i.pravatar.cc/64?u=${props?.user.username}`
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
]);
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

