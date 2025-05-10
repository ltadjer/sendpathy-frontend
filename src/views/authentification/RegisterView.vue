<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-padding-start ion-padding-end">
      <ion-toolbar class="ion-no-shadow">
        <ion-buttons slot="start">
          <ion-back-button :defaultHref="true" :icon="arrowBackOutline" @click="navigateToLogin" text="" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col class="ion-text-center">
            <img
                alt="Logo"
                :src="getLogo"
                width="120px"
            />
            <ion-text>
              <h1 class="gradient-text ion-input-spacing">Hâte de te connaître !</h1>
            </ion-text>
            <form @submit.prevent="register" class="ion-text-left form-container">
              <custom-button expand="block" :text="'Générer un avatar'" @click.prevent="generateAvatars" class="ion-margin-bottom"></custom-button>
              <div class="avatar-selection">
                <div v-for="(avatar, index) in avatars" :key="index" class="avatar-container"
                     :class="{ 'selected': avatar === selectedAvatar }"
                     @click="selectAvatar(avatar)">
                  <img
                    :src="avatar"
                    alt="Avatar proposé"
                    class="avatar-option"
                  />
                </div>
              </div>

              <ion-input
                class="ion-input-spacing"
                placeholder="Email"
                type="email"
                v-model="email"
                required
              ></ion-input>
              <ion-input
                class="ion-input-spacing"
                placeholder="Pseudo"
                type="text"
                v-model="username"
                required
              ></ion-input>
              <ion-select
                class="ion-input-spacing"
                interface="popover"
                placeholder="Année de naissance"
                v-model="yearOfBirth"
                required
              >
                <ion-select-option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </ion-select-option>
              </ion-select>

                <ion-input
                  :type="passwordType"
                  placeholder="Mot de passe"
                  v-model="password"
                  class="ion-input-spacing"
                  required
                >
                  <ion-icon
                    slot="end"
                    :icon="passwordType === 'password' ? eyeOutline : eyeOffOutline"
                    @click="togglePassword('password')"
                    class="password-toggle-icon"
                  ></ion-icon>
                </ion-input>


                <ion-input
                  :type="confirmPasswordType"
                  placeholder="Confirmez le mot de passe"
                  v-model="confirmPassword"
                  required
                >
                  <ion-icon
                    slot="end"
                    :icon="confirmPasswordType === 'password' ? eyeOutline : eyeOffOutline"
                    @click="togglePassword('confirm')"
                    class="password-toggle-icon"
                  ></ion-icon>
                </ion-input>
              <ion-list class="password-list">
                <ion-item v-for="(rule, index) in passwordRules" :key="index" lines="none" class="ion-no-shadow">
                  <ion-icon
                    slot="start"
                    :icon="rule.check(password) ? checkmarkOutline : closeOutline"
                  ></ion-icon>
                  <ion-label :class="{ 'valid': rule.check(password) }">
                    {{ rule.message }}
                  </ion-label>
                </ion-item>
              </ion-list>

              <custom-button expand="block"  type="submit" text="S'inscrire"></custom-button>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ToastMessage/>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonList,
  IonLabel,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonButtons
} from '@ionic/vue';
import {
  arrowBackOutline,
  checkmarkOutline,
  closeOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';
import CustomButton from '@/components/Commun/CustomButton.vue';
import { useAccountStore } from '@/stores/account';
import { useToastStore } from '@/stores/toast';
import lightLogo from '@/assets/logo-light.svg';
import darkLogo from '@/assets/logo-dark.svg';

export default defineComponent({
  name: 'RegisterView',
  components: {
    CustomButton,
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonList,
    IonLabel,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonButtons
  },
  data() {
    return {
      isDarkMode: false,
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      nativeLanguage: '',
      yearOfBirth: null,
      selectedAvatar: '',
      avatars: [],
      years: [],
      passwordType: 'password',
      confirmPasswordType: 'password',
      passwordRules: [
        { check: (v) => !!v, message: 'Le champ mot de passe est requis' },
        { check: (v) => v && v.length >= 12, message: 'Le mot de passe doit contenir au moins 12 caractères' },
        { check: (v) => v && /[A-Za-z]/.test(v), message: 'Le mot de passe doit contenir au moins une lettre' },
        { check: (v) => v && /\d/.test(v), message: 'Le mot de passe doit contenir au moins un chiffre' },
        { check: (v) => v && /[!@#$%^&*(),.?":{}|<>]/.test(v), message: 'Le mot de passe doit contenir au moins un caractère spécial' },
      ],
    };
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

    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 18;
    for (let year = startYear; year >= startYear - 82; year--) {
      this.years.push(year);
    }

    const browserLanguage = navigator.language || 'fr';
    console.log('Langue par défaut du navigateur :', browserLanguage);
    this.nativeLanguage = browserLanguage;
  },
  setup() {
    const toastStore = useToastStore();
    return { arrowBackOutline, toastStore, checkmarkOutline, closeOutline, eyeOutline, eyeOffOutline };
  },
  methods: {
    generateAvatars() {
      const newAvatars = [];
      const backgroundColors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
      for (let i = 0; i < 6; i++) {
        const seed = `${this.username}-${Math.random().toString(36).substr(2, 9)}`;
        const backgroundColor = backgroundColors[i % backgroundColors.length];
        newAvatars.push(`https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=${backgroundColor}`);
      }
      this.avatars = newAvatars;
    },
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
    },
    togglePassword(field) {
      if (field === 'password') {
        this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
      } else {
        this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password';
      }
    },
    async register() {
      try {
        if (this.password !== this.confirmPassword) {
          this.toastStore.showToast('Les mots de passe ne correspondent pas.', 'primary');
          return;
        }

        const isValid = this.passwordRules.every((rule) => rule.check(this.password));
        if (!isValid) {
          this.toastStore.showToast('Veuillez respecter les règles de mot de passe.', 'primary');
          return;
        }
        const age = new Date().getFullYear() - this.yearOfBirth;
        if (age < 18) {
          this.toastStore.showToast('Vous devez avoir au moins 18 ans pour vous inscrire.', 'primary');
          return;
        }

        const user = {
          email: this.email,
          username: this.username,
          password: this.password,
          age: age,
          avatar: this.selectedAvatar,
          nativeLanguage: this.nativeLanguage,
        };

        await useAccountStore().register(user);
      } catch (error) {
        console.error("Échec de l'inscription :", error);
      }
    },
    navigateToLogin() {
      this.$router.push('/connexion');
    }
  }
});
</script>

<style scoped>
.password-list {
  margin: 1rem 0;
}
.password-list .valid {
  font-weight: bold;
}
.password-toggle-icon {
  cursor: pointer;
}
.password-list ion-label {
  font-size: 0.8rem;
}

.avatar-container.selected {
  background: var(--ion-color-primary);
}
</style>
