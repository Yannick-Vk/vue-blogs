<script setup lang="ts">
import {computed} from "vue";

interface Props {
  searchTerm: string;
  title?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:searchTerm']);

const searchTermValue = computed({
  get: () => props.searchTerm,
  set: (value) => emit('update:searchTerm', value)
});

function clearSearch() {
  searchTermValue.value = '';
}
</script>

<template>
  <UInput
      v-model="searchTermValue"
      :placeholder="title?? 'Type something...'"
      :ui="{ trailing: 'pe-1' }"
      size="xl"
      icon="lucide:search"
  >
    <template v-if="searchTermValue?.length" #trailing>
      <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="lucide:circle-x"
          aria-label="Clear input"
          @click="clearSearch"
      />
    </template>
  </UInput>
</template>