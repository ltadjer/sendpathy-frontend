<template>
  <ion-page>
    <ion-header class="ion-padding-start ion-padding-end">
      <ion-toolbar class="ion-no-shadow">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/feed" :icon="arrowBackOutline" text="" :animated="false" />
        </ion-buttons>
        <ion-title>Notifications</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list v-if="notifications && notifications.length > 0" class="ion-padding">
        <ion-item-sliding v-for="notification in notifications" :key="notification.id" class="notification-item">
        <ion-item lines="none" class="notification-item">
          <ion-avatar slot="start">
            <img :src="notification.sender.avatar" alt="Sender Avatar" />
          </ion-avatar>
          <ion-label>
            <h2>{{ notification.message }}</h2>
            <p>{{ formatDate(notification.createdAt) }}</p>
          </ion-label>
          <div v-if="notification.type === 'FRIEND_REQUEST' && !isFriendshipAccepted(notification.sender.id)" class="notification-actions">
            <custom-button @click="acceptFriendRequest(notification)" text="Accepter"></custom-button>
            <custom-button @click="ignoreFriendRequest(notification)" text="Ignorer"></custom-button>
          </div>
          <div v-else-if="notification.type === 'FRIEND_REQUEST_ACCEPTED' && isFriendshipAccepted(notification.sender.id) && !isFriend(notification.sender.id) && !isFriendshipPending(notification.sender.id) && isSent" class="notification-actions">
            <custom-button @click="inviteBack(notification.sender.id)" text="Inviter en retour"></custom-button>
          </div>
        </ion-item>
          <ion-item-options side="end">
            <ion-item-option @click="deleteNotification(notification.id)">
              <span class="item-option-text">Supprimer</span>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <ion-item v-else lines="none" class="ion-margin">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="12">
              <ion-label>
                <h2 class="font-bold">Aucune de notification</h2>
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonItemSliding,
  IonItemOptions,
  IonItemOption, IonGrid, IonRow, IonCol,
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { useFriendshipStore } from '@/stores/friendship';
import { useAccountStore } from '@/stores/account'
import CustomButton from "@/components/Commun/CustomButton.vue";

export default defineComponent({
  components: {
    IonCol, IonRow, IonGrid,
    CustomButton,
    IonBackButton,
    IonButtons,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  },
  data() {
    return {
      isSent: false,
    };
  },
  computed: {
    notifications() {
      return useNotificationStore().notifications;
    },
    friendships() {
      return useFriendshipStore().friendships;
    },
    currentUser() {
      return useAccountStore().user;
    },
  },
  setup() {
    return {
      arrowBackOutline,
    };
  },
  async created() {
    await useFriendshipStore().fetchAllFriendships();
    await useNotificationStore().fetchAllNotifications();
  },
  methods: {
    async markAsRead(notificationId: string) {
      await useNotificationStore().markAsRead(notificationId);
    },
    isFriendshipAccepted(senderId: string) {
      const isReceiver = this.friendships.find(f => f.requesterId === senderId && f.receiverId === this.currentUser.id);
      return isReceiver && isReceiver.status === 'ACCEPTED';
    },
    isFriend(userId: string) {
      return this.friendships.some(f => (f.requesterId === userId && f.receiverId === userId) && f.status === 'ACCEPTED');
    },
    isFriendshipPending(userId: string) {
      return this.friendships.some(f => f.requesterId === this.currentUser.id && f.receiverId === userId);
    },
    async acceptFriendRequest(notification) {
      const friendship = this.friendships.find(f => f.requesterId === notification.sender.id && f.receiverId === this.currentUser.id);
      if (friendship) {
        await useFriendshipStore().acceptFriendship(friendship.id);
        notification.message = `${notification.sender.username} a commencé à vous suivre`;
        await useNotificationStore().updateNotificationMessage(notification.id, notification.message);
        await useNotificationStore().fetchAllNotifications();
      }
    },
    async ignoreFriendRequest(notification) {
      const friendship = this.friendships.find(f => f.requesterId === notification.sender.id);
      if (friendship) {
        await useFriendshipStore().deleteOneFriendship(friendship.id);
      }
    },
    async deleteNotification(notificationId: string) {
      await useNotificationStore().deleteOneNotification(notificationId);
      await useNotificationStore().fetchAllNotifications();
    },
    async inviteBack(userId: string) {
      await useFriendshipStore().createOneFriendship({ requesterId: this.currentUser.id, receiverId: userId, status: 'PENDING' });
      this.isSent = true;
      await useNotificationStore().fetchAllNotifications();
    },
    formatDate(dateString: string) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    },
  },
});
</script>

<style scoped>
.notification-item ion-avatar {
  margin-right: 10px;
}

.notification-item h2 {
  font-size: 1rem;
  margin: 0;
  font-weight: bold;
}

.notification-item p {
  font-size: 0.8rem;
  color: gray;
  margin: 0;
}

.notification-actions {
  display: flex;
  gap: 10px;
}

ion-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>