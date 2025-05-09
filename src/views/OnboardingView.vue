<template>
  <ion-page>
    <ion-content class="ion-padding onboarding-content">
      <swiper
          :pagination="{ clickable: true }"
          :loop="false"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          class="onboarding-swiper"
      >
        <swiper-slide class="slide slide-animated-logo">
          <img src="@/assets/logo.svg" alt="Sendpathy Logo" class="logo-animate" />
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
          <div class="modes">
            <div class="mode-card">
              <h2><span class="gradient-text">Fil d’actualité</span></h2>
              <p>
                Découvrez et réagissez aux émotions de la communauté,
                anonymement.
              </p>
            </div>
            <div class="mode-card">
              <h2><span class="gradient-text">Journal intime</span></h2>
              <p>
                Écrivez vos pensées et ressentez l’apaisement d’un espace perso.
              </p>
            </div>
          </div>
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
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import CustomButton from '@/components/Commun/CustomButton.vue'

export default defineComponent({
  name: 'OnboardingView',
  components: { IonPage, IonContent, Swiper, SwiperSlide, CustomButton },
  methods: {
    goToLogin() {
      localStorage.setItem('onboardingCompleted', 'true')
      this.$router.push('/connexion')
    }
  }
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

/* Cloud group container */
.cloud {
  position: absolute;
  display: flex;
  align-items: center;
}

.cloud .circle {
  background: var(--ion-color-light);
  border-radius: 50%;
  box-shadow: -8px -8px 16px #ffffff, 8px 8px 16px rgba(0, 0, 0, 0.1);
}

.cloud .c1 {
  width: 80px;
  height: 80px;
}

.cloud .c2 {
  width: 60px;
  height: 60px;
  margin-left: -20px;
}

.cloud .c3 {
  width: 100px;
  height: 100px;
  margin-left: -20px;
}

.cloud1 {
  top: 10%;
  left: 10%;
}

.cloud2 {
  bottom: 10%;
  right: 10%;
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
  color: var(--ion-color-secondary);
}

.slide-modes .modes {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.mode-card {
  margin-top: 1rem;
  background: var(--ion-color-light);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: var(--neumorphism-out-shadow);
}

.mode-card img {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

.mode-card h2 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.mode-card p {
  font-size: 0.85rem;
  color: var(--ion-color-medium);
}

.slide img {
  width: 100%;
  max-width: 220px;
}
</style>