<script lang="ts" setup>
import {ref} from "vue";

const links = ref([
  {
    label: 'Create an account',
    to: '/Login',
    icon: 'lucide:user'
  },
  {
    label: 'Learn more',
    to: 'https://github.com/Yannick-Vk/vue-blogs',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'lucide:github'
  }
])
</script>

<template>
  <UPageHero
      :links="links"
      description="A blogging site made with Vue and Nuxt Ui on the frontend and with a C# web API on the backend, click on any blog to start reading. Want to create your own blogs? Press the login button to create a free account."
      title="Vue blogger"
  />
</template>
