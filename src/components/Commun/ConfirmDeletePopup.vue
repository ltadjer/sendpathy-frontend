<template>
  <ion-alert
      :is-open="show"
      header="Confirmation"
      message="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      :buttons="[
      {
        text: 'Annuler',
        role: 'cancel',
        handler: close
      },
      {
        text: 'Supprimer',
        role: 'destructive',
        handler: confirm
      }
    ]"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonAlert } from '@ionic/vue';

export default defineComponent({
  name: 'ConfirmDeletePopup',
  components: { IonAlert },
  props: {
    show: { type: Boolean, required: true }
  },
  emits: ['close', 'confirm'],
  methods: {
    close() { this.$emit('close'); },
    confirm() { this.$emit('confirm'); }
  }
});
</script>
<style scoped>
ion-alert {
  color: var(--ion-text-color);
}
</style>