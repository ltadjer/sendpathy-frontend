<template>
  <ion-app>
    <LoadingScreen :isLoading="isLoading" :logo="getLogo" />
    <ToastMessage />
    <ion-router-outlet></ion-router-outlet>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { defineComponent, onMounted } from 'vue'
import ToastMessage from '@/components/Common/ToastMessage.vue'
import LoadingScreen from '@/components/Common/LoadingScreen.vue'
import { isLoading } from '@/router'
import darkLogo from '@/assets/img/logo-dark.svg'
import lightLogo from '@/assets/img/logo-light.svg'

export default defineComponent({
  name: 'App',
  components: { ToastMessage, IonApp, IonRouterOutlet, LoadingScreen },
  setup() {
    onMounted(() => {
      setTimeout(() => {
        isLoading.value = false
      }, 2000)
    })

    return { isLoading }
  },
  computed: {
    getLogo() {
      return this.isDarkMode ? darkLogo : lightLogo
    }
  },
  created() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.isDarkMode = darkModeMediaQuery.matches

    darkModeMediaQuery.addEventListener('change', (e) => {
      this.isDarkMode = e.matches
    })
  }
})
</script>
