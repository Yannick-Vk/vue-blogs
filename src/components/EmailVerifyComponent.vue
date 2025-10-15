<script setup lang="ts">
const props = defineProps({
  confirmed: Boolean,
})
</script>

<template>
  <div>
    <UAlert variant="subtle" class="text-center w-96 mx-auto mt-5"
            :color="confirmed? 'success' : 'error'"
            :title="confirmed? 'Verification success' : 'Verification failed'"
            :icon="confirmed? 'lucide:shield-check' : 'lucide:shield-x'"
            :ui="{
              icon: 'size-8',
              title: 'text-xl'
            }"
    />
  </div>
</template>

<style scoped>

</style>