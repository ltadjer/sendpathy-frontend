<template>
  <ion-page>
    <ion-content class="ion-padding ion-text-center">
      <div class="error-container">
        <h1 class="gradient-text">404</h1>
        <p>Oups ! La page que vous cherchez n'existe pas.</p>
        <custom-button
          :text="'Retour à l\'accueil'"
          :icon="'home'"
          @click="goHome"
        ></custom-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonContent, } from '@ionic/vue';
import CustomButton from "@/components/Commun/CustomButton.vue";

export default defineComponent({
  name: 'NotFoundView',
  components: {CustomButton, IonPage, IonContent, },
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
});
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>