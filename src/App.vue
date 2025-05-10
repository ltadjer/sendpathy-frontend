<template>
  <ion-app>
    <LoadingScreen :isLoading="isLoading" />
    <ToastMessage />
    <ion-router-outlet></ion-router-outlet>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent, ref, onMounted } from 'vue';
import ToastMessage from "@/components/Commun/ToastMessage.vue";
import LoadingScreen from "@/components/Commun/LoadingScreen.vue";
import { isLoading } from '@/router';

export default defineComponent({
  name: 'App',
  components: { ToastMessage, IonApp, IonRouterOutlet, LoadingScreen },
  setup() {

    onMounted(() => {
      setTimeout(() => {
        isLoading.value = false; // Simule un chargement
      }, 2000);
    });

    return { isLoading };
  },
});
</script>