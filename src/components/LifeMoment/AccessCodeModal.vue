<template>
  <ion-modal
      :is-open="isOpen"
      :backdrop-dismiss="true"
      :swipe-to-close="true"
      :presenting-element="'ion-page'"
      class="non-blocking-modal"
  >
    <ion-card class="ion-padding">
      <ion-label position="stacked">{{ hasAccessCode ? 'Entrer le code d\'accès' : 'Définir un code d\'accès' }}</ion-label>
      <ion-input class="ion-margin-top" v-model="accessCode" type="password"></ion-input>
      <div class="ion-text-end">
        <custom-button :text="hasAccessCode ? 'Entrer' : 'Définir'" @click="handleAccessCode"></custom-button>
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
import { useToastStore } from "@/stores/toast"

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
    }
  },
  data() {
    return {
      accessCode: ''
    };
  },
  setup() {
    const toastStore = useToastStore();
    return { toastStore };
  },
  methods: {
    async handleAccessCode() {
      try {
        if (this.hasAccessCode) {
          const isValid = await useAccountStore().validateAccessCode(this.accessCode);
          if (isValid) {
            this.$emit('access-code-validated');
            this.toastStore.showToast('Code d\'accès validé avec succès', 'primary');
            this.closeModal();
          } else {
            this.toastStore.showToast('Échec de la validation du code d\'accès', 'primary');
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
ion-modal.non-blocking-modal {
  pointer-events: none; /* Permet de cliquer sur les éléments en arrière-plan */
}

ion-modal.non-blocking-modal ion-card {
  pointer-events: auto; /* Permet d'interagir avec le contenu du modal */
}
</style>
