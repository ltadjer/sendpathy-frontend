<template>
  <ion-page>
    <ion-content class="ion-padding onboarding-content" :fullscreen="true">
      <swiper
          @swiper="onSwiperReady"
          @slideChange="onSlideChange"
          :pagination="{ clickable: true }"
          :loop="false"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          class="onboarding-swiper"
      >
        <swiper-slide class="slide slide-animated-logo">
          <img
              alt="Logo"
              :src="getLogo"
              width="120px"
              class="logo-animate"
          />
        </swiper-slide>
        <swiper-slide class="slide slide-welcome">
          <img src="@/assets/onboarding1.png" alt="Communauté empathique" />
          <h1><span class="gradient-text">Bienvenue sur Sendpathy</span></h1>
          <p>
            Un espace bienveillant pour partager et comprendre vos émotions,
            anonymement et en toute sécurité.
          </p>
        </swiper-slide>
        <swiper-slide class="slide slide-modes">
          <h1><span class="gradient-text">Deux façons de vous exprimer</span></h1>
          <div class="cards">
            <ion-card class="ion-no-margin ion-margin-bottom">
              <ion-card-header>
                <ion-card-title><span class="gradient-text">Fil d’actualité</span></ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Découvrez et réagissez aux émotions de la communauté, anonymement.
              </ion-card-content>
            </ion-card>

            <ion-card class="ion-no-margin">
              <ion-card-header>
                <ion-card-title><span class="gradient-text">Journal intime</span></ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Écrivez vos pensées et ressentez l’apaisement d’un espace perso.
              </ion-card-content>
            </ion-card>
          </div>
        </swiper-slide>
        <swiper-slide class="slide slide-psy">
          <img src="@/assets/onboarding3.png" alt="Fonctionnalités" />
          <h1><span class="gradient-text">Accompagnement Psy</span></h1>
          <p>
            Besoin de parler à un professionnel ?
            Réservez facilement une séance en visio et prenez soin de vous.
          </p>
          <custom-button text="Commencer" @click="goToLogin" :icon="arrowForwardOutline" />
        </swiper-slide>
      </swiper>


      <custom-button
          v-if="currentSlideIndex > 0"
          class="nav-button prev-button"
          @click="goToPreviousSlide"
          :icon="chevronBackOutline"
      />
      <custom-button
          class="nav-button next-button" @click="goToNextSlide" :icon="chevronForwardOutline" v-if="currentSlideIndex !== 3"></custom-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonIcon, IonButton } from '@ionic/vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import CustomButton from '@/components/Commun/CustomButton.vue'
import darkLogo from "@/assets/logo-dark.svg";
import lightLogo from "@/assets/logo-light.svg";
import {arrowForwardOutline, chevronForwardOutline, chevronBackOutline} from "ionicons/icons";

export default defineComponent({
  name: 'OnboardingView',
  components: { IonPage, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, Swiper, SwiperSlide, CustomButton, IonIcon, IonButton },
  data() {
    return {
      swiperInstance: null,
      isDarkMode: false as boolean,
      currentSlideIndex: 0 as number, // Index actuel de la slide
    }
  },
  computed: {
    getLogo() {
      return this.isDarkMode ? darkLogo : lightLogo;
    },
  },
  setup() {
    return {
      chevronForwardOutline,
      chevronBackOutline,
      arrowForwardOutline
    }
  },
  created() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;

    console.log('Dark mode:', this.isDarkMode);

    // Écoute les changements de mode
    darkModeMediaQuery.addEventListener('change', (e) => {
      this.isDarkMode = e.matches;
    });
  },
  methods: {
    onSwiperReady(swiper) {
      this.swiperInstance = swiper // Initialise l'instance de Swiper
    },
    onSlideChange() {
      if (this.swiperInstance) {
        this.currentSlideIndex = this.swiperInstance.activeIndex; // Met à jour l'index actuel
      }
    },
    goToNextSlide() {
      if (this.swiperInstance) {
        this.swiperInstance.slideNext(); // Passe à la slide suivante
      }
    },
    goToPreviousSlide() {
      if (this.swiperInstance) {
        this.swiperInstance.slidePrev(); // Retourne à la slide précédente
      }
    },
    goToLogin() {
      localStorage.setItem('onboardingCompleted', 'true')
      this.$router.push('/connexion')
    },
  },
})
</script>

<style scoped>
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: .8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.logo-animate {
  width: 180px;
  height: 180px;
  animation: pulse 2s ease-in-out infinite;
}

.onboarding-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}


.onboarding-swiper {
  width: 100%;
  height: 100%;
}

.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
}

.slide h1 {
  color: var(--ion-color-primary);
}

ion-card img {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

ion-card ion-card-title {
  font-size: 1.1rem;
  margin-bottom: 4px;
}

ion-card p {
  font-size: 0.85rem;
  color: var(--ion-color-medium);
}

.slide img {
  width: 100%;
  max-width: 220px;
}

.cards {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.cards ion-card {
  width: 100%;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .cards {
    flex-direction: row;
  }
}


@keyframes bounce {
  0%, 100% {
    transform: rotate(-45deg) translateX(0);
  }
  50% {
    transform: rotate(-45deg) translateX(10px);
  }
}
@keyframes fadeIn {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.nav-button {
  position: absolute;
  bottom: 0;
  transform: translateY(-50%);
  z-index: 10;
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}
</style>