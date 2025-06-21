<template>
  <ion-page>
    <ion-header>
      <MainHeader
          title="Conversations"
          :showAvatar="true"
          :avatarSrc="currentUser?.avatar"
          @avatar-click="showUserProfile(currentUser)"
          :showEndButtons="true"
          :showLogo="false"
      >
        <template #extra-content>
          <ion-searchbar class="ion-margin-top ion-no-padding" v-model="searchTerm" placeholder="Rechercher"></ion-searchbar>
        </template>
      </MainHeader>
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
import { IonPage, } from '@ionic/vue';
import { useAccountStore } from '@/stores/account';
import { useConversationStore } from '@/stores/conversation';
import MainHeader from '@/components/Commun/MainHeader.vue';
import { IonHeader, IonSearchbar } from '@ionic/vue';

export default defineComponent({
  name: 'ConversationView',
  components: {
    ConversationList,
    FriendshipsModal,
    IonPage,
    MainHeader,
    IonSearchbar,
    IonHeader

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
<style scoped>
ion-button {
  --background: transparent !important;
}
</style>