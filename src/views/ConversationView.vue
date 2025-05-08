<template>
  <ion-page>
    <ion-header>
      <ion-header :translucent="true" class="ion-padding header-page">
        <ion-toolbar>
          <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
            <div class="avatar-container" @click.stop="showUserProfile(currentUser)">
              <ion-avatar slot="start">
                <img alt="User Avatar" :src="currentUser?.avatar" />
              </ion-avatar>
            </div>
            <ion-title>Conversations</ion-title>
          </ion-item>
          <ion-buttons slot="end">
            <ion-button size="small" class="ion-no-shadow">
              <img alt="Logo" src="../assets/logo.svg" width="70px" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-searchbar class="ion-margin-top ion-no-padding" v-model="searchTerm" placeholder="Rechercher"></ion-searchbar>
      </ion-header>
    </ion-header>
    <ConversationList
        :conversations="conversations"
        :current-user="currentUser"
        :search-term="searchTerm"
        @open-friendships-modal="openFriendshipsModal"
    />
    <friendships-modal
        :is-open="isFriendshipsModalOpen"
        :friends-list="friendsList"
        @close="closeFriendshipsModal"
        @select="handleFriendSelection"
    />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConversationList from '@/components/Message/ConversationList.vue';
import FriendshipsModal from '@/components/Message/FriendshipsModal.vue';
import { IonPage, IonButton, IonButtons, IonTitle, IonSearchbar, IonToolbar, IonItem, IonHeader, IonAvatar } from '@ionic/vue';
import { useAccountStore } from '@/stores/account';
import { useConversationStore } from '@/stores/conversation';

export default defineComponent({
  name: 'ConversationView',
  components: {
    IonButton, IonButtons, IonTitle, IonSearchbar, IonToolbar, IonItem, IonHeader, IonAvatar,
    ConversationList, FriendshipsModal, IonPage
  },
  data() {
    return {
      searchTerm: '',
      isFriendshipsModalOpen: false,
    };
  },
  computed: {
    conversations() {
      return useConversationStore().conversations;
    },
    currentUser() {
      return useAccountStore().user;
    },
    friendsList() {
      const received = this.currentUser?.friendshipsReceived
          ?.filter(friendship => friendship.status === 'ACCEPTED')
          .map(friendship => friendship.requester) || [];

      const sent = this.currentUser?.friendshipsSent
          ?.filter(friendship => friendship.status === 'ACCEPTED')
          .map(friendship => friendship.receiver) || [];

      return received.filter(friend =>
          sent.some(sentFriend => sentFriend.id === friend.id)
      );
    },
  },
  methods: {
    showUserProfile(user) {
      this.$router.push({ name: 'UserProfile', params: { userId: user.id } });
    },
    openFriendshipsModal() {
      this.isFriendshipsModalOpen = true;
    },
    closeFriendshipsModal() {
      this.isFriendshipsModalOpen = false;
    },
    async handleFriendSelection(friend) {
      const conversationStore = useConversationStore();
      const existingConversation = conversationStore.conversations.find(
          conversation => conversation.user?.id === friend.id
      );

      if (existingConversation) {
        this.$router.push(`/conversations/${existingConversation.id}`);
      } else {
        const newConversation = await conversationStore.createOneConversation({
          userIds: [this.currentUser.id, friend.id],
          conversationType: 'PRIVATE',
        });
        this.$router.push(`/conversations/${newConversation.id}`);
      }

      this.closeFriendshipsModal();
    },
  },
  async created() {
    await useConversationStore().fetchAllConversations();
  },
});
</script>