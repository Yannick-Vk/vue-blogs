<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import {reactive} from "vue";
import {useProfileStore} from "@/stores/profileStore.ts";

const authStore = useAuthStore();
const user = authStore.user;
const profileStore = useProfileStore();

const schema = z.object({
  email: z.email('Email is required')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await profileStore.changeEmail(event.data.email);
    toast.add({
      title: 'Successfully changed email',
      description: `Email has been changed to ${event.data.email}`,
      color: 'success'
    })
  } catch (e) {
    console.error(e)
    toast.add({
      title: "Failed to change email",
      description: `Failed to update email-address to ${event.data.email}`,
      color: 'error'
    })
  }

}
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Profile</h2>
    <div v-if="user">
      <UUser

          :name="user.username"
          :description="user.email"
          :avatar="{
          src: `https://i.pravatar.cc/64?u=${user.username}`,
        }"
          size="3xl"
      />
      <UCard variant="subtle" class="my-4">
        <h3 class="text-lg mb-3 text-primary">Change email</h3>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Email" name="email">
            <UInput v-model="state.email" type="email" placeholder="Please enter new email ..." class="w-96"/>
          </UFormField>

          <UButton type="submit">
            Change email
          </UButton>
        </UForm>
      </UCard>


    </div>

    <div v-else>
      <p>Loading user profile...</p>
    </div>
  </div>
</template>

<style scoped>

</style>