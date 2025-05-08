<template>
  <ion-page>
    <ion-content class="ion-padding onboarding-content">
      <swiper
          :pagination="{ clickable: true }"
          class="onboarding-swiper"
          :loop="false"
      >
        <swiper-slide class="slide slide-animated-logo">
          <img src="@/assets/logo.svg" alt="Sendpathy Logo" class="logo-animate" />
        </swiper-slide>
        <swiper-slide class="slide slide-welcome">
          <div class="shape"></div>
          <img src="@/assets/onboarding1.png" alt="Communauté empathique" />
          <h1><span class="gradient-text">Bienvenue sur Sendpathy</span></h1>
          <p>
            Un espace bienveillant pour partager et comprendre vos émotions,
            anonymement et en toute sécurité.
          </p>
        </swiper-slide>
        <swiper-slide class="slide slide-modes">
          <div class="shape"></div>
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
          <div class="shape"></div>
          <img src="@/assets/onboarding3.png" alt="Fonctionnalités" />
          <h1> <span class="gradient-text">Accompagnement Psy </span></h1>
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
  0%   { transform: scale(1);   opacity: 1; }
  50%  { transform: scale(1.1); opacity: .8; }
  100% { transform: scale(1);   opacity: 1; }
}

.logo-animate {
  width: 180px;
  height: 180px;
  animation: pulse 2s ease-in-out infinite;
}

.slide-animated-logo h1 {
  font-size: 2rem;
}

.slide-animated-logo p {
  max-width: 90%;
  text-align: center;
}
.onboarding-content {
  display: flex;
  justify-content: center;
  align-items: center;
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

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/background1.png');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.onboarding-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide img {
  position: relative;
  z-index: 1;
}

.shape {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  box-shadow: var(--neumorphism-in-shadow);
  z-index: 0;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.2;
  background: var(--ion-color-tertiary);
}

.slide {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
}

.slide img {
  position: relative;
  z-index: 1;
}
</style>
