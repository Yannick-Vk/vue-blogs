<script lang="ts" setup>
import {ref} from "vue";

const show = ref(false)
const password = defineModel<string>()

interface Props {
  placeholder?: string,
}

const props = defineProps<Props>()
</script>

<template>
  <UInput
      v-model="password"
      :placeholder="placeholder?? 'Password'"
      :type="show ? 'text' : 'password'"
      :ui="{ trailing: 'pe-1' }"
  >
    <template #trailing>
      <UButton
          :aria-label="show ? 'Hide password' : 'Show password'"
          :aria-pressed="show"
          :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          aria-controls="password"
          color="neutral"
          size="sm"
          variant="link"
          @click="show = !show"
      />
    </template>
  </UInput>
</template>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
  display: none;
}
</style>

