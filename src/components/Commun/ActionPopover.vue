<template>
  <ion-popover :trigger="triggerId" :dismiss-on-select="true" side="top" alignment="end">
    <ion-list>
      <ion-item
          v-for="(action, index) in actions"
          :key="index"
          lines="none"
          :button="true"
          :detail="false"
          @click="handleAction(action)"
      >
        {{ action.label }}
      </ion-item>
    </ion-list>
  </ion-popover>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPopover, IonList, IonItem } from '@ionic/vue';

export default defineComponent({
  name: 'ActionPopover',
  components: {
    IonPopover,
    IonList,
    IonItem,
  },
  props: {
    triggerId: {
      type: String,
      required: true,
    },
    actions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleAction(action) {
      if (action.handler) {
        action.handler();
      }
    },
  },
});
</script>