<template>
  <ion-modal :is-open="isOpen"  class="non-blocking-modal">
      <ion-card class="ion-padding ion-no-shadow">
          <ion-label position="stacked">{{ hasAccessCode ? 'Entrer le code d\'accès' : 'Définir un code d\'accès' }}</ion-label>
          <ion-input minlength="4" v-model="accessCode" type="password" inputmode="numeric"></ion-input>
          <div class="ion-text-end">
            <custom-button :disabled="accessCode.length < 5" :text="hasAccessCode ? 'Entrer' : 'Définir'" @click="handleAccessCode"></custom-button>
          </div>
      </ion-card>
  </ion-modal>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonModal,
  IonLabel,
  IonInput,
  IonCard,
} from '@ionic/vue';
import CustomButton from '@/components/Commun/CustomButton.vue'
import { useAccountStore } from '@/stores/account.ts'

export default defineComponent({
  name: 'AccessCodeModal',
  components: {
    CustomButton,
    IonModal,
    IonLabel,
    IonInput,
    IonCard,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    hasAccessCode: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      accessCode: ''
    };
  },
  methods: {
    async handleAccessCode() {
      try {
        if (this.hasAccessCode) {
          const isValid = await useAccountStore().validateAccessCode(this.accessCode);
          if (isValid) {
            this.$emit('access-code-validated');
            this.closeModal();
          } else {
            console.error('Invalid access code');
          }
        } else {
         this.accessCode =  await useAccountStore().setAccessCode(this.accessCode);
          this.$emit('access-code-set');
          this.closeModal();
        }
      } catch (error) {
        console.error('Error handling access code:', error);
      }
    },
    closeModal() {
      this.$emit('update:isOpen', false);
    }
  }
});
</script>
<style scoped>
ion-modal {
  --width: fit-content;
  --height: fit-content;
  --min-width: 350px;
  --max-width: 350px;
  --border-radius: 1rem;
  display: flex;
  align-items: center;
}
</style>
