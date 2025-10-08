<script lang="ts" setup>
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
      icon="lucide:search"
      size="xl"
  >
    <template v-if="searchTermValue?.length" #trailing>
      <UButton
          aria-label="Clear input"
          color="neutral"
          icon="lucide:circle-x"
          size="sm"
          variant="link"
          @click="clearSearch"
      />
    </template>
  </UInput>
</template>