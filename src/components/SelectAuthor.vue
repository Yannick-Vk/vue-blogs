<script setup lang="ts">
import {reactive} from "vue";
import * as z from "zod";
import type {FormSubmitEvent} from "@nuxt/ui";

const toast = useToast();

const props = defineProps({
  users: Array<string>,
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

</script>

<template>
  <UPageCard class="w-full max-w-md">
    <template #header>
      <h2 class="text-2xl">Add another author</h2>
    </template>

    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="User" name="user">
          <UInputMenu v-model="state.user" placeholder="Select a user" :items="items" />
        </UFormField>

        <UButton type="submit">
          Submit
        </UButton>
      </UForm>

    </template>
  </UPageCard>
</template>

<style scoped>

</style>