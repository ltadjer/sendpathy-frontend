<template>
  <div v-if="isLoading" class="loading-screen">
    <img :src="logo" alt="Logo" class="loading-logo" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import logo from '@/assets/logo-light.svg';

export default defineComponent({
  name: 'LoadingScreen',
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      logo,
    };
  },
  mounted() {
    console.log('LoadingScreen mounted');
  }
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--ion-background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-logo {
  width: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>