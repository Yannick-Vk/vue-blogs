<script lang="ts" setup>
import * as z from 'zod'
import {onMounted, reactive} from "vue";
import type {FormSubmitEvent} from "@nuxt/ui";
import {useProfileStore} from "@/stores/profileStore.ts";
import {useUserStore} from "@/stores/userStore.ts"
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";

const toast = useToast();
const router = useRouter();
const userStore = useUserStore();
const {currentUser} = storeToRefs(userStore);

const schema = z.object({
  username: z.string('Username is required'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const profileStore = useProfileStore();
    const username = event.data.username;
    await profileStore.changeUsername(username);

    toast.add({
      title: `Changed username to ${username}`,
      description: `Created profile with username ${username}`,
      color: "success",
      icon: "lucide:check",
    })
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  await userStore.getUser();
  console.log(currentUser.value.username);
})
</script>

<template>
  <UContainer class="max-w-3xl">
    <h2 class="text-3xl text-primary">Welcome to JS-Blogger</h2>
    <p class="text-lg">Your account has been created, but may require some changes.</p>
    <UCard variant="subtle" class="mt-8" v-if="currentUser">
      <h3 class="mb-3">Your current username is
        <span class="font-bold text-primary">{{ currentUser?.username ?? "unknown" }}</span>
        , do you want to change it?</h3>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Username" name="username">
          <UInput v-model="state.username" class="w-full" placeholder="Please enter a username ..."/>
        </UFormField>

        <UButton type="submit">
          Change username
        </UButton>
      </UForm>
    </UCard>
    <div v-else>Loading user data...</div>
  </UContainer>
</template>