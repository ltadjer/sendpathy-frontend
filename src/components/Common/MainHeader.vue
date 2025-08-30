<template>
  <ion-header class="ion-padding header-page">
    <ion-toolbar>
      <ion-buttons slot="start" v-if="showBackButton">
        <ion-back-button :defaultHref="defaultHref" :icon="arrowBackOutline" text="" />
      </ion-buttons>
      <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
        <div class="avatar-container" v-if="showAvatar" @click="onAvatarClick">
          <ion-avatar slot="start">
            <img :src="avatarSrc" alt="User Avatar" />
          </ion-avatar>
        </div>
        <ion-title>{{ title }}</ion-title>
        <img v-if="showLogo" alt="Logo" src="../../assets/img/logo-light.svg" class="header-logo" />
      </ion-item>
      <ion-buttons slot="end" v-if="showEndButtons">
        <slot name="end-buttons"></slot>
      </ion-buttons>
    </ion-toolbar>
    <slot name="extra-content"></slot>
  </ion-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonAvatar,
  IonTitle
} from '@ionic/vue'
import { arrowBackOutline } from 'ionicons/icons'

export default defineComponent({
  name: 'MainHeader',
  components: {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonItem,
    IonAvatar,
    IonTitle
  },
  props: {
    title: {
      type: String,
      required: true
    },
    showBackButton: {
      type: Boolean,
      default: false
    },
    defaultHref: {
      type: String,
      default: '/'
    },
    showAvatar: {
      type: Boolean,
      default: false
    },
    avatarSrc: {
      type: String,
      default: ''
    },
    showEndButtons: {
      type: Boolean,
      default: false
    },
    showLogo: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      arrowBackOutline
    }
  },
  emits: ['avatar-click'],
  methods: {
    onAvatarClick() {
      this.$emit('avatar-click')
    }
  }
})
</script>

<style scoped>
.avatar-container {
  cursor: pointer;
}

.header-logo {
  width: 70px;
  margin-left: auto;
}

ion-button {
  --background: transparent !important;
}
</style>
