<template>
  <ion-page>
    <MainHeader
        title="Moments de vie"
        :showAvatar="true"
        :avatarSrc="currentUser?.avatar"
        :showEndButtons="true"
        :showLogo="false"
    >
    </MainHeader>
    <ion-content>
      <access-code-modal
        :is-open="isAccessCodeModalOpen"
        :has-access-code="hasAccessCode"
        @update:isOpen="(value) => isAccessCodeModalOpen = value"
        @access-code-set="fetchLifeMoments"
        @access-code-validated="fetchLifeMoments">
      </access-code-modal>
      <life-moment-list v-if="!isAccessCodeModalOpen && lifeMoments" :life-moments="lifeMoments" :current-user="currentUser" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import LifeMomentList from '@/components/LifeMoment/LifeMomentList.vue';
import AccessCodeModal from '@/components/LifeMoment/AccessCodeModal.vue';
import { useLifeMomentStore } from '@/stores/life-moment';
import { useAccountStore } from '@/stores/account';
import { onIonViewDidEnter, IonPage, IonContent } from '@ionic/vue';
import MainHeader from '@/components/Commun/MainHeader.vue';

export default defineComponent({
  name: 'LifeMomentView',
  components: {
    MainHeader,
    AccessCodeModal,
    LifeMomentList,
    IonContent,
    IonPage
  },
  data() {
    return {
      isAccessCodeModalOpen: false,
      hasAccessCode: false,
    };
  },
  computed: {
    lifeMoments() {
      return useLifeMomentStore().lifeMoments.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    currentUser() {
      return useAccountStore().user;
    }
  },
  methods: {
    async fetchLifeMoments() {
      await useLifeMomentStore().fetchLifeMoments();
    },
    async checkAccessCode() {
      console.log('isAccessCodeModalOpen:', this.isAccessCodeModalOpen);
      if (this.isAccessCodeModalOpen) {
        console.log('Access code modal is already open');
        return;
      }
      const accessCode = useAccountStore().user?.accessCode;
      console.log('Checking access code:', accessCode);
      if (!accessCode) {
        console.log('No access code found, opening modal to set access code');
        this.isAccessCodeModalOpen = true;
        this.hasAccessCode = false;
      } else {
        console.log('Access code found, validating access code');
        this.isAccessCodeModalOpen = true;
        this.hasAccessCode = true;
        await this.fetchLifeMoments();
      }
    }
  },
  mounted() {
    onIonViewDidEnter(() => {
      this.checkAccessCode();
    });

    // Watch for route changes
    watch(
        () => this.$route,
        () => {
          this.isAccessCodeModalOpen = false;
        }
    );
  }
});
</script>
<style scoped>
@media (min-width: 1024px) {
  ion-router-outlet .ion-page {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ion-content {
    width: 90%
  }
}
</style>