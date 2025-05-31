<template>
  <ion-content>
    <ion-list class="ion-padding">
      <template v-if="filteredConversations && filteredConversations.length > 0">
        <ion-item-sliding
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            class="conversation-item"
        >
          <ion-item @click="selectConversation(conversation)" lines="none">
            <div class="avatar-container">
              <ion-avatar slot="start">
                <img :src="conversation.user?.avatar || '/default-avatar.png'" alt="User Avatar" />
              </ion-avatar>
            </div>
            <ion-label>
              <h2>{{ conversation.user?.username }}</h2>
              <p :class="{ 'last-message': true, 'unread': conversation.lastMessage?.read === false && conversation.lastMessage?.senderId !== currentUser.id }">
                {{ conversation.lastMessage?.content }}
              </p>
            </ion-label>
            <ion-note slot="end" class="time">
              {{ timeSince(conversation.lastMessage?.createdAt) }}
            </ion-note>
            <ion-badge v-if="conversation.lastMessage?.read === false && conversation.lastMessage?.senderId !== currentUser.id" color="secondary" slot="end">1</ion-badge>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option @click="deleteOneConversation(conversation.id)">
              <span class="item-option-text">Supprimer</span>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </template>
      <template v-else>
        <ion-item lines="none" class="no-conversations">
          <ion-grid>
            <ion-row class="ion-justify-content-center">
              <ion-col size="12">
          <ion-label>
            <h2>Aucune conversation pour le moment... </h2>
            <p>Osez faire le premier pas et partagez ce que vous ressentez. Vous n’êtes pas seul·e.</p>
          </ion-label>
              </ion-col>
            </ion-row>
            <ion-row class="ion-justify-content-center">
              <ion-col size="12" class="ion-text-center">
          <custom-button expand="block" @click="openFriendshipsModal" text="Créer une conversation">
          </custom-button>
            </ion-col>
          </ion-row>
        </ion-grid>
        </ion-item>
      </template>
    </ion-list>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonNote,
  IonBadge,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonButton,
  IonCol, IonRow, IonGrid
} from '@ionic/vue';
import { timeSince } from '@/utils/date';
import { useConversationStore } from '@/stores/conversation';
import CustomButton from "@/components/Commun/CustomButton.vue";

export default defineComponent({
  name: 'ConversationList',
  props: {
    currentUser: {
      type: Object,
      required: true,
    },
    conversations: {
      type: Array,
      required: true,
    },
    searchTerm: {
      type: String,
      default: '',
    },
  },
  components: {
    CustomButton,
    IonGrid, IonRow, IonCol,
    IonAvatar, IonLabel, IonNote, IonBadge,
    IonContent, IonList, IonItem,
    IonItemSliding, IonItemOptions, IonItemOption, IonButton
  },
  computed: {
    filteredConversations() {
      return this.conversations
          .filter(conversation => {
            if (this.searchTerm.trim() === '') {
              return true;
            }
            return conversation.user?.username.toLowerCase().includes(this.searchTerm.toLowerCase());
          })
          .filter(conversation => conversation.lastMessage?.deletedBy !== this.currentUser.id);
    },
  },
  methods: {
    async selectConversation(conversation) {
      await this.markMessagesAsRead(conversation.id);
      this.$router.push(`/conversations/${conversation.id}`);
    },
    async markMessagesAsRead(conversationId) {
      await useConversationStore().markMessagesAsRead(conversationId);
    },
    async deleteOneConversation(conversationId) {
      await useConversationStore().deleteOneConversation(conversationId);
    },
    openFriendshipsModal() {
      this.$emit('open-friendships-modal');
    },
    timeSince,
  },
});
</script>

<style scoped>
ion-list {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}

.conversation-item ion-label {
  width: calc(100% - 60px);
}

.conversation-item .last-message.unread {
  font-weight: bold;
}

.avatar-container {
  margin-bottom: 0;
  margin: 0.6rem;
}

.time {
  color: var(--ion-text-color);
}
</style>