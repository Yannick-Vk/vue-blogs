<script lang="ts" setup>
import type {DropdownMenuItem} from '@nuxt/ui'
import type {User} from '../stores/auth.ts'
import {useProfileStore} from "@/stores/profileStore.ts";
import {computed, onMounted, ref, watch} from "vue";

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

watch(() => props.user.username, async (newUsername, oldUsername) => {
  if (newUsername !== oldUsername) {
    await fetchAvatar();
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
      onSelect: async () => {
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
  <UDropdownMenu :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 8
    }" :items="items" :ui="{ content: 'w-48' }" arrow>
    <UButton :label="props?.user.username" color="neutral" icon="lucide:user" size="lg" variant="outline"/>
  </UDropdownMenu>
</template>

