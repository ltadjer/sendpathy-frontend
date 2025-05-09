<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-padding header-page">
      <ion-toolbar>
        <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
          <div class="avatar-container">
            <ion-avatar slot="start">
              <img alt="User Avatar" :src="currentUser?.avatar" />
            </ion-avatar>
          </div>
          <ion-title>Réservations</ion-title>
        </ion-item>
        <ion-buttons slot="end">
          <ion-button size="small" class="ion-no-shadow">
            <img alt="Logo" src="@/assets/logo.svg" width="70px" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <reservation-list :reservations="reservations" :current-user="currentUser" :therapists="therapists"/>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {IonAvatar, IonButton, IonButtons, IonHeader, IonItem, IonPage, IonTitle, IonToolbar} from '@ionic/vue'
import { useReservationStore } from '@/stores/reservation'
import { useAccountStore } from '@/stores/account'
import ReservationList from '@/components/Reservation/ReservationList.vue'
import authService from '@/services/auth.service'

export default defineComponent({
  name: 'ReservationView',
  components: {
    IonAvatar, IonToolbar, IonItem, IonHeader, IonButtons, IonButton, IonTitle,
    IonPage,
    ReservationList,
  },
  data() {
    return {
      therapists: []
    }
  },
  computed: {
    reservations() {
      return useReservationStore().reservations?.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    currentUser() {
      return useAccountStore().user;
    }
  },
  async created() {
    await useReservationStore().fetchAllReservations();
    this.therapists = await authService.fetchAllTherapists();
  }
});
</script>