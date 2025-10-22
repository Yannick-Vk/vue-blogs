<script lang="ts" setup>
import * as z from 'zod'
import {reactive} from "vue";
import type {FormSubmitEvent} from "@nuxt/ui";
import {useProfileStore} from "@/stores/profileStore.ts";
import {useRouter} from "vue-router";

const toast = useToast();
const router = useRouter();

const schema = z.object({
  username: z.string('Username is required'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const profileStore = useProfileStore();
  const username = event.data.username;
  await profileStore.changeUsername(username);

  toast.add({
    title: `Changed username to ${username}`,
    description: `Created profile with username ${username}`,
    color: "success",
    icon: "lucide:check",
  })

  await router.push("home");
}
</script>

<template>
  <UCard variant="subtle" class="mt-5">
    <h3 class="text-lg mb-3 text-primary">Create profile</h3>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Username" name="username">
        <UInput v-model="state.username" class="w-full" placeholder="Please enter a username ..."/>
      </UFormField>

      <UButton type="submit">
        Create profile
      </UButton>
    </UForm>
  </UCard>
</template>