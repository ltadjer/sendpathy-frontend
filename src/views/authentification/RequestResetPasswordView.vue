<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :defaultHref="true" :icon="arrowBackOutline" text=""/>
        </ion-buttons>
        <ion-title>Réinitialiser du mot de passe</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid class="flex-center">
        <ion-row>
          <ion-col class="ion-text-center">
            <img alt="Logo" src="../../assets/img/logo-light.svg" width="140px"/>
            <form @submit.prevent="requestPasswordReset" class="ion-text-start form-container">
              <ion-input placeholder="Email" type="email" v-model="email" required></ion-input>
              <custom-button expand="block" color="primary" type="submit" text="Envoyer"></custom-button>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import { IonPage, IonContent, IonInput, IonGrid, IonRow, IonCol, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons  } from '@ionic/vue';
  import { arrowBackOutline } from 'ionicons/icons';
  import { useAccountStore } from '@/stores/account'
  import CustomButton from '@/components/Commun/CustomButton.vue'
  
  export default defineComponent( {
    name: 'RequestResetPasswordView',
    data() {
      return {
        email: '',
        message: ''
      };
    },
    components: {
      CustomButton,
      IonPage,
      IonContent,
      IonInput,
      IonGrid,
      IonRow,
      IonCol,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonBackButton,
      IonButtons
    },
    setup() {
      return { arrowBackOutline };
    },
    methods: {
      async requestPasswordReset() {
        await useAccountStore().requestPasswordReset(this.email);
      },
    }
  });
  </script>