<template>
  <ion-page>
    <ion-content class="ion-padding onboarding-content">
      <swiper
          @swiper="onSwiperReady"
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
          <img src="@/assets/onboarding2.png" alt="Fonctionnalités" />
          <h1><span class="gradient-text">Deux façons de vous exprimer</span></h1>
          <ion-grid>
            <ion-row>
              <ion-col size="12" size-md="6">
                <ion-card>
                  <ion-card-header>
                    <ion-card-title><span class="gradient-text">Fil d’actualité</span></ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    Découvrez et réagissez aux émotions de la communauté, anonymement.
                  </ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col size="12" size-md="6">
                <ion-card>
                  <ion-card-header>
                    <ion-card-title><span class="gradient-text">Journal intime</span></ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    Écrivez vos pensées et ressentez l’apaisement d’un espace perso.
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </swiper-slide>
        <swiper-slide class="slide slide-psy">
          <img src="@/assets/onboarding3.png" alt="Fonctionnalités" />
          <h1><span class="gradient-text">Accompagnement Psy</span></h1>
          <p>
            Besoin de parler à un professionnel ?
            Réservez facilement une séance en visio et prenez soin de vous.
          </p>
          <custom-button text="Commencer" @click="goToLogin" />
        </swiper-slide>
      </swiper>
      <div class="swipe-indicator">
        <p>Swipe</p>
        <span class="arrow"></span>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import CustomButton from '@/components/Commun/CustomButton.vue'
import darkLogo from "@/assets/logo-dark.svg";
import lightLogo from "@/assets/logo-light.svg";

export default defineComponent({
  name: 'OnboardingView',
  components: { IonPage, IonContent, Swiper, SwiperSlide, CustomButton },
  data() {
    return {
      swiperInstance: null, // Stocke l'instance de Swiper
      isDarkMode: false as boolean,
    }
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
  },
  methods: {
    goToLogin() {
      localStorage.setItem('onboardingCompleted', 'true')
      this.$router.push('/connexion')
    },
    onSwiperReady(swiper) {
      this.swiperInstance = swiper // Initialise l'instance de Swiper
      setTimeout(() => {
        this.swiperInstance.slideTo(1) // Passe au deuxième slide (index 1)
      }, 3000)
    }
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

.swipe-indicator {
  position: absolute;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  animation: fadeIn 1.5s ease-in-out infinite;
  right: 10%;
}

.slide-animated-logo .swipe-indicator {
  display: none;
}

.swipe-indicator p {
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--ion-color-primary);
}
.swipe-indicator .arrow {
  width: 24px;
  height: 24px;
  border: solid var(--ion-color-primary);
  border-width: 0 3px 3px 0;
  transform: rotate(-45deg);
  margin-bottom: 5px;
  animation: bounce 1.5s infinite;
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
</style>