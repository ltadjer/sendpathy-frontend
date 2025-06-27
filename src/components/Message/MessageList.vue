<template>
  <ion-header :translucent="true" class="ion-padding header-page">
    <ion-toolbar>
      <ion-item lines="none" class="ion-no-shadow">
        <ion-back-button defaultHref="/conversations" :icon="arrowBackOutline" text="" />
        <div class="avatar-container" @click.stop="showUserProfile(receiver)">
          <ion-avatar slot="start">
            <img alt="User Avatar" :src="receiver?.avatar" />
          </ion-avatar>
        </div>
        <ion-title>{{ receiver?.username }}</ion-title>
      </ion-item>
    </ion-toolbar>
  </ion-header>

  <ion-content
      ref="contentRef"
      class="message-content"
      forceOverscroll="true"
      scrollEvents
      @ionScroll="onScroll"
  >
    <ion-infinite-scroll
        threshold="15%"
        position="top"
        @ionInfinite="loadMoreMessages"
    >
      <ion-infinite-scroll-content
          loadingSpinner="bubbles"
          loadingText=""
      ></ion-infinite-scroll-content>
    </ion-infinite-scroll>

    <ion-list class="ion-padding">
      <template v-for="(messageGroup, index) in groupedMessages" :key="index">
        <div class="date-separator">{{ formatDate(messageGroup.date) }}</div>
        <ion-item
            lines="none"
            v-for="message in messageGroup.messages"
            :key="message.id"
            :class="{ 'message-out': message.isSentByCurrentUser, 'ion-no-shadow': !message.isSentByCurrentUser }"
            class="ion-margin-bottom"
            @click="openPopover($event, message)"
        >
          <div class="avatar-container">
            <ion-avatar slot="start" v-if="!message.isSentByCurrentUser">
              <img :src="message.sender?.avatar || '/default-avatar.png'" alt="User Avatar" />
            </ion-avatar>
          </div>
          <div class="message-container" :class="{ 'message-in': !message.isSentByCurrentUser }">
            <ion-label>
              <p :class="{ 'unread': !message.read }">{{ message.content }}</p>
            </ion-label>
            <ion-text
                v-if="message.translatedContent"
                class="toggle-original"
                @click.stop="toggleOriginal(message)"
            >
              Voir l'original
            </ion-text>
            <ion-note slot="end" class="time">
              <sub>{{ timeSince(message.createdAt) }}</sub>
            </ion-note>
          </div>
        </ion-item>
      </template>
    </ion-list>

    <ion-note v-if="!isFriend" class="ion-shadow-in ion-padding">
      Vous ne pouvez plus envoyer de messages à cette personne.
    </ion-note>
  </ion-content>

  <MessageForm
      v-if="isFriend"
      @newMessage="addMessage"
      @editMessage="editMessage"
      :conversation-id="conversationId"
      :receiver-id="receiver?.id"
      :sender-name="currentUser.username"
      :editingMessage="editingMessage"
  />

  <ion-popover :is-open="popoverOpen" @didDismiss="popoverOpen = false" :event="popoverEvent">
    <ion-list>
      <ion-item lines="none" button v-if="selectedMessage?.isSentByCurrentUser" @click="editSelectedMessage">Modifier</ion-item>
      <ion-item lines="none" button @click="translateMessage(selectedMessage)">Traduire</ion-item>
      <ion-item lines="none" button @click="deleteMessageForUser">Supprimer pour moi</ion-item>
      <ion-item lines="none" button v-if="selectedMessage?.isSentByCurrentUser" @click="deleteMessageForAll">Supprimer pour tous</ion-item>
    </ion-list>
  </ion-popover>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref, nextTick } from 'vue';
import {
  IonToolbar, IonHeader, IonBackButton, IonTitle,
  IonContent, IonAvatar, IonItem, IonLabel,
  IonNote, IonList, IonPopover, IonText,
  IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import WebSocketService from '@/services/websocket.service';
import MessageForm from '@/components/Message/MessageForm.vue';
import { timeSince, formatDate } from '@/utils/date';
import { useConversationStore } from '@/stores/conversation';
import { translateText } from '@/utils/translate';

export default defineComponent({
  name: 'MessageList',
  components: {
    IonToolbar, IonHeader, IonBackButton, IonTitle,
    IonContent, IonAvatar, IonItem, IonLabel,
    IonNote, IonList, IonPopover, IonText,
    IonInfiniteScroll, IonInfiniteScrollContent,
    MessageForm
  },
  props: {
    currentUser: { type: Object, required: true },
    conversationId: { type: String, required: true },
    conversation: { type: Object }
  },
  setup() {
    return { arrowBackOutline };
  },
  data() {
    return {
      messages: [],
      loading: false,
      popoverOpen: false,
      popoverEvent: null,
      selectedMessage: null,
      editingMessage: null,
      page: 1,
      limit: 10,
      allMessagesLoaded: false
    };
  },
  computed: {
    filteredMessages() {
      return this.messages.filter(m => m.deletedBy !== this.currentUser.id);
    },
    receiver() {
      return this.conversation?.user;
    },
    groupedMessages() {
      const groups = [];
      let currentGroup = { date: null, messages: [] };
      this.filteredMessages.forEach(message => {
        const dateStr = new Date(message.createdAt).toDateString();
        if (currentGroup.date !== dateStr) {
          if (currentGroup.messages.length) groups.push(currentGroup);
          currentGroup = { date: dateStr, messages: [] };
        }
        currentGroup.messages.push(message);
      });
      if (currentGroup.messages.length) groups.push(currentGroup);
      return groups;
    },
    isFriend() {
      if (!this.currentUser || !Array.isArray(this.currentUser.friendshipsReceived) || !Array.isArray(this.currentUser.friendshipsSent)) return false;
      const recv = this.currentUser.friendshipsReceived.some(f => f.requesterId === this.receiver?.id && f.status === 'ACCEPTED');
      const sent = this.currentUser.friendshipsSent.some(f => f.receiverId === this.receiver?.id && f.status === 'ACCEPTED');
      return recv || sent;
    }
  },
  methods: {
    timeSince,
    formatDate,
    async fetchMessages() {
      if (this.loading || this.allMessagesLoaded) return;
      this.loading = true;
      const newMsgs = await useConversationStore().fetchAllMessages(this.conversationId, this.page, this.limit);
      if (newMsgs.length < this.limit) this.allMessagesLoaded = true;
      this.messages = [...newMsgs.reverse(), ...this.messages];
      this.page++;
      this.loading = false;
    },
    async loadMoreMessages(event: any) {
      await this.fetchMessages();
      event.target.complete();
    },
    onScroll(event: any) {
      // Optional scroll tracking
    },
    async scrollToBottom() {
      await nextTick();
      const el = (this.$refs.contentRef as any)?.$el;
      if (el?.scrollToBottom) {
        setTimeout(() => {
          el.scrollToBottom(300);
        }, 50);
      } else {
        console.warn('scrollToBottom non disponible', el);
      }
    },
    openPopover(event: any, message: any) {
      this.popoverEvent = event;
      this.selectedMessage = message;
      this.popoverOpen = true;
    },
    editSelectedMessage() {
      this.editingMessage = this.selectedMessage;
      this.popoverOpen = false;
    },
    async deleteMessageForAll() {
      WebSocketService.emit('deleteMessage', { id: this.selectedMessage.id });
      this.popoverOpen = false;
    },
    async deleteMessageForUser() {
      WebSocketService.emit('deleteMessageForUser', { id: this.selectedMessage.id });
      this.popoverOpen = false;
    },
    addMessage(msg: any) {
      if (!this.messages.find(m => m.id === msg.id)) {
        msg.isSentByCurrentUser = msg.senderId === this.currentUser.id;
        this.messages.push(msg);
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    editMessage(updated: any) {
      const idx = this.messages.findIndex(m => m.id === updated.id);
      if (idx !== -1) this.messages[idx].content = updated.content;
    },
    async translateMessage(message: any) {
      const lang = this.currentUser.nativeLanguage || navigator.language.split('-')[0];
      const text = await translateText(message.content, lang);
      if (text) message.translatedContent = text;
      this.popoverOpen = false;
    },
    toggleOriginal(message: any) {
      if (message.translatedContent) message.translatedContent = null;
    },
    showUserProfile(user: any) {
      this.$router.push({ name: 'UserProfile', params: { userId: user.id } });
    }
  },
  async mounted() {
    await this.fetchMessages();
    this.$nextTick(() => {
      this.scrollToBottom();
    });

    WebSocketService.on('newMessage', this.addMessage);
    WebSocketService.on('messageUpdated', this.editMessage);
    WebSocketService.on('messageDeleted', (id: string) => {
      this.messages = this.messages.filter(m => m.id !== id);
    });
    WebSocketService.on('messageDeletedForUser', (id: string) => {
      this.messages = this.messages.filter(m => m.id !== id);
    });

    onUnmounted(() => {
      WebSocketService.off('newMessage', this.addMessage);
      WebSocketService.off('messageUpdated', this.editMessage);
      WebSocketService.off('messageDeleted');
    });

    WebSocketService.socket.on('disconnect', () => console.warn('WebSocket disconnected'));
    WebSocketService.socket.on('connect', () => console.log('WebSocket connected'));
  }
});
</script>

<style scoped>
.message-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-x: hidden;
  text-align: center;
}

ion-note {
  border-radius: 1rem;
}

.date-separator {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: var(--ion-color-medium);
}

.message-out {
  align-self: flex-end;
  border-radius: 1rem;
  margin-left: auto;
  width: fit-content;
}

.message-in {
  align-self: flex-start;
border-radius: 1rem;
padding: 0.8rem;
box-shadow: var(--neumorphism-in-shadow) !important;
}

.time {
  font-size: 0.8rem;
}
</style>
