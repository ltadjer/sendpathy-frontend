<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-grid class="flex-center">
        <ion-row>
          <ion-col class="ion-text-center">
            <img
                alt="Logo"
                :src="getLogo"
                width="120px"
            />
            <form @submit.prevent="login" class="ion-text-start form-container">
              <ion-input
                class="ion-input-spacing"
                placeholder="Email"
                type="email"
                v-model="email"
                required
              ></ion-input>
              <ion-input
                class="ion-input-spacing"
                :type="passwordType"
                placeholder="Mot de passe"
                v-model="password"
                required
              >
                <ion-icon
                  slot="end"
                  :icon="passwordType === 'password' ? eyeOutline : eyeOffOutline"
                  @click="togglePassword"
                  class="password-toggle-icon"
                ></ion-icon>
              </ion-input>
              <custom-button
                expand="block"
                type="submit"
                text="Se connecter"
              ></custom-button>
            </form>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-text-center ion-margin-top">
            <ion-text>
              <span @click="navigateToForgotPassword">Mot de passe oublié ?</span>
              <p>
                Vous n’avez pas de compte? <strong @click="navigateToRegister">S’inscrire</strong>
              </p>
            </ion-text>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ToastMessage />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useAccountStore } from '@/stores/account.ts'
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonInput,
  IonIcon
} from '@ionic/vue'
import { eyeOutline, eyeOffOutline } from 'ionicons/icons'
import CustomButton from '@/components/Commun/CustomButton.vue'
import { defineComponent } from 'vue'
import ToastMessage from '@/components/Commun/ToastMessage.vue'
import { useToastStore } from '@/stores/toast'
import darkLogo from "@/assets/logo-dark.svg";
import lightLogo from "@/assets/logo-light.svg";

export default defineComponent({
  name: 'LoginView',
  components: {
    ToastMessage,
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonInput,
    IonIcon,
    CustomButton
  },
  data() {
    return {
      isDarkMode: false as boolean,
      email: '' as string,
      password: '' as string,
      message: '' as string,
      passwordType: 'password' as string,
    }
  },
  setup() {
    const toastStore = useToastStore()
    return { toastStore, eyeOutline, eyeOffOutline }
  },
  computed: {
    getLogo() {
      return this.isDarkMode ? darkLogo : lightLogo;
    },
  },
  created() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;

    console.log('Dark mode:', this.isDarkMode);

    // Écoute les changements de mode
    darkModeMediaQuery.addEventListener('change', (e) => {
      this.isDarkMode = e.matches;
    });

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('message')) {
      this.message =
        urlParams.get('message') === 'email_confirmed' ? 'Votre compte a bien été confirmé.' : ''
      this.toastStore.showToast(this.message, 'success')
    }
  },
  methods: {
    togglePassword(): void {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
    },
    async login() {
      try {
        const user = {
          email: this.email,
          password: this.password
        }
        await useAccountStore().login(user)
        this.$router.push('/feed')
      } catch (error) {
        console.error('Login failed:', error)
      }
    },
    navigateToForgotPassword(): void {
      this.$router.push('/request-password-reset')
    },
    navigateToRegister(): void {
      this.$router.push('/inscription')
    }
  }
})
</script>

<style scoped>
.password-toggle-icon {
  cursor: pointer;
}
</style>
