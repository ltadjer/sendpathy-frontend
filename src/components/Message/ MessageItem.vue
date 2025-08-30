<template>
  <ion-item
    :lines="none"
    :class="{
      'message-out': message.isSentByCurrentUser,
      'ion-no-shadow': !message.isSentByCurrentUser
    }"
    class="ion-margin-bottom"
    :id="'popover-button-' + message.id"
    @click.stop
  >
    <div class="avatar-container">
      <ion-avatar v-if="!message.isSentByCurrentUser">
        <img :src="message.sender?.avatar || '/default-avatar.png'" alt="User Avatar" />
      </ion-avatar>
    </div>
    <div class="message-container" :class="{ 'message-in': !message.isSentByCurrentUser }">
      <ion-label>
        <p :class="{ unread: !message.read }">{{ message.content }}</p>
      </ion-label>
      <ion-text
        v-if="message.translatedContent"
        class="toggle-original"
        @click.stop="toggleOriginal(message)"
      >
        Voir l'original
      </ion-text>
      <ion-note class="time">
        <sub>{{ timeSince(message.createdAt) }}</sub>
      </ion-note>
    </div>
    <ActionPopover :trigger-id="'popover-button-' + message.id" :actions="actions" />
  </ion-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonItem, IonAvatar, IonLabel, IonText, IonNote } from '@ionic/vue'
import ActionPopover from '@/components/Common/ActionPopover.vue'
import { timeSince } from '@/utils/date'

export default defineComponent({
  name: 'MessageItem',
  components: { IonItem, IonAvatar, IonLabel, IonText, IonNote, ActionPopover },
  props: {
    message: { type: Object, required: true },
    actions: { type: Array, required: true }
  },
  methods: {
    timeSince,
    toggleOriginal(message) {
      if (message.translatedContent) {
        message.translatedContent = null
      }
    }
  }
})
</script>

<style scoped>
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
