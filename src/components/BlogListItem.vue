<script setup lang="ts">
import {ref} from "vue";

type orientationEnum = "horizontal" | "vertical";

const title = ref<string>("")
const description = ref<string>("")
const icon = ref<string>("")
const orientation = ref<orientationEnum>("horizontal")

</script>

<template>
  <UPageCard
      :title="title"
      :description="description"
      :icon="icon"
      :orientation="orientation"
      spotlight
      spotlight-color="primary"
  >
    <img src="../assets/logo.svg" alt="Tailwind CSS" class="w-full" />
  </UPageCard>
</template>