<script setup lang="ts">
import * as z from 'zod'
import {reactive} from "vue";
import type {FormSubmitEvent} from "@nuxt/ui";

const schema = z.object({
  image: z
      .instanceof(File, {
        message: 'Please select an image file.'
      })
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  image: undefined,
})

const emit = defineEmits(['submit'])

function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('submit', event.data.image)
}

defineExpose({
  reset
})
function reset() {
  state.image = undefined;
}
</script>

<template>
  <UCard variant="subtle">
    <h3 class="text-lg mb-3 text-primary">Change profile picture</h3>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFileUpload v-model="state.image" label="click or drop your profile picture here" accept="image/*" class="min-h-48"/>

      <UButton type="submit">
        Change profile picture
      </UButton>
    </UForm>
  </UCard>
</template>