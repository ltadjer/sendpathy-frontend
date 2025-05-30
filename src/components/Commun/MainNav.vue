<template>
    <ion-split-pane when="(min-width: 1200px)" content-id="main">
      <ion-menu content-id="main" class="sidebar-menu" v-if="isDesktop">
        <ion-header>
          <ion-toolbar>
            <div class="avatar-container" @click="showUserProfile(currentUser)">
              <ion-avatar slot="center">
                <img :src="currentUser?.avatar" alt="User Avatar" />
              </ion-avatar>
            </div>
          </ion-toolbar>
        </ion-header>
          <ion-list class="link-list">
            <custom-button id="tab-feed" :class="{ 'ion-shadow-in': isActiveTab('/feed') }" text="Feed" href="/feed" />
            <custom-button id="tab-journal" text="Moments de vie" :class="{ 'ion-shadow-in': isActiveTab('/journal') }"  href="/journal" />
            <custom-button id="tab-conversations" text="Messages" :class="{ 'ion-shadow-in': isActiveTab('/conversations') }"  href="/conversations" />
            <custom-button id="tab-parameters" text="Paramètres" :class="{ 'ion-shadow-in': isActiveTab('/parametres') }"  href="/parametres" />
          </ion-list>
      </ion-menu>

      <div  v-if="isDesktop || isExcludedRoute" class="main-content" id="main">
        <ion-router-outlet />
      </div>
    </ion-split-pane>

    <div v-if="!isDesktop && !isExcludedRoute" class="mobile-nav">
      <ion-tabs>
        <ion-router-outlet />

        <ion-tab-bar id="tab-feed" slot="bottom" class="ion-margin">
          <ion-tab-button tab="feed" href="/feed"
                          :class="{ 'ion-shadow-in': isActiveTab('/feed') }">
            <ion-icon :icon="homeOutline" />
          </ion-tab-button>

          <ion-tab-button id="tab-journal" tab="journal" href="/journal"
                          :class="{ 'ion-shadow-in': isActiveTab('/journal') }">
            <ion-icon :icon="journalOutline" />
          </ion-tab-button>

          <!-- dummy tab-button to satisfy Ionic, disabled so it never actually switches -->
          <ion-tab-button tab="dummy" disabled>
            <ion-icon slot="icon-only" :icon="add" />
          </ion-tab-button>

          <ion-tab-button id="tab-conversations" tab="conversations" href="/conversations"
                          :class="{ 'ion-shadow-in': isActiveTab('/conversations') }">
            <ion-icon :icon="chatbubblesOutline" />
          </ion-tab-button>

          <ion-tab-button id="tab-parameters" tab="parametres" href="/parametres"
                          :class="{ 'ion-shadow-in': isActiveTab('/parametres') }">
            <ion-icon :icon="settingsOutline" />
          </ion-tab-button>
        </ion-tab-bar>


      </ion-tabs>
      <!-- now render the FAB in its own slot so its click is purely your modal logic -->
      <ion-fab vertical="bottom" horizontal="center">
        <ion-fab-button @click="openFormModal">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>

      <post-form-modal v-if="isPostFormModalOpen" @close="closePostFormModal" :current-user="currentUser"/>
      <life-moment-form-modal v-if="isLifeMomentModalOpen" @close="closeLifeMomentModal"/>
      <friendships-modal
          :is-open="isFriendshipsModalOpen"
          :friends-list="friendsList"
          @close="closeFriendshipsModal"
          @select="handleFriendSelection"
      />
    </div>
</template>

<script lang="ts">
import {
  IonPage, IonSplitPane, IonMenu, IonHeader, IonToolbar,
  IonAvatar, IonList, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton,
  IonIcon, IonFab, IonFabButton
} from '@ionic/vue';

import { defineComponent } from 'vue';
import { useAccountStore } from '@/stores/account';
import { useConversationStore } from '@/stores/conversation';

import {
  settingsOutline, homeOutline, chatbubblesOutline,
  journalOutline, todayOutline, add, logOutOutline
} from 'ionicons/icons';

import CustomButton from '@/components/Commun/CustomButton.vue';
import PostFormModal from '@/components/Feed/PostFormModal.vue';
import LifeMomentFormModal from '@/components/LifeMoment/LifeMomentFormModal.vue';
import FriendshipsModal from '@/components/Message/FriendshipsModal.vue';

export default defineComponent({
  name: 'MainNav',
  components: {
    IonPage, IonSplitPane, IonMenu, IonHeader, IonToolbar,
    IonAvatar, IonList, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton,
    IonIcon, IonFab, IonFabButton,
    CustomButton, PostFormModal, LifeMomentFormModal, FriendshipsModal
  },
  data() {
    return {
      homeOutline,
      chatbubblesOutline,
      journalOutline,
      settingsOutline,
      todayOutline,
      add,
      logOutOutline,
      isPostFormModalOpen: false as boolean,
      isLifeMomentModalOpen: false as boolean,
      isFriendshipsModalOpen: false as boolean,
    };
  },
  computed: {
    currentUser() {
      return useAccountStore().user;
    },
    isExcludedRoute() {
      const excludedRoutes = ['/notifications', '/parametres', '/user'];
      const currentRoute = this.currentRoute;

      const isConversationRoute = /^\/conversations\/[^/]+$/.test(currentRoute);

      return excludedRoutes.some(route => currentRoute.startsWith(route)) || isConversationRoute;
    },
    currentRoute() {
      return this.$route.path;
    },
    isDesktop() {
      return window.innerWidth > 1200;
    },
    friendsList() {
      const received = this.currentUser?.friendshipsReceived
          ?.filter(f => f.status === 'ACCEPTED')
          .map(f => f.requester) || [];

      const sent = this.currentUser?.friendshipsSent
          ?.filter(f => f.status === 'ACCEPTED')
          .map(f => f.receiver) || [];

      return received.filter(friend => sent.some(s => s.id === friend.id));
    }
  },
  methods: {
    openFormModal() {
      switch (this.$route.path) {
        case '/journal':
          this.isLifeMomentModalOpen = true;
          break;
        case '/reservations':
          this.$router.push('/reservations/nouvelle-reservation/');
          break;
        case '/feed':
          this.isPostFormModalOpen = true;
          break;
        case '/conversations':
          this.isFriendshipsModalOpen = true;
          break;
      }
    },
    closePostFormModal() {
      this.isPostFormModalOpen = false;
    },
    closeLifeMomentModal() {
      this.isLifeMomentModalOpen = false;
    },
    closeFriendshipsModal() {
      this.isFriendshipsModalOpen = false;
    },
    async handleFriendSelection(friend) {
      const conversationStore = useConversationStore();
      const existing = conversationStore.conversations.find(c => c.user?.id === friend.id);
      if (existing) {
        this.$router.push(`/conversations/${existing.id}`);
      } else {
        const newConv = await conversationStore.createOneConversation({
          userIds: [this.currentUser.id, friend.id],
          conversationType: 'PRIVATE',
        });
        this.$router.push(`/conversations/${newConv.id}`);
      }
      this.closeFriendshipsModal();
    },
    isActiveTab(path: string): boolean {
      return this.currentRoute === path;
    },
    showUserProfile(user) {
      if (user?.id) {
        this.$router.push(`/user/${user.id}`);
      }
    }
  }
});
</script>

<style scoped>

ion-menu::part(container) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.avatar-container {
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}
ion-avatar {
  width: 80px;
  height: 80px;
}

.sidebar-menu {
  --width: 200px;
  padding: 20px;
  background: var(--ion-background-color);
  box-shadow: var(--neumorphism-out-shadow);
  margin: 1rem;
  border-radius: 1rem;;
}

.link-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 80%;
}
.button-list ion-button {
  --border-radius: 50% !important;
}
.link-list ion-button {
  width: inherit;
  margin: 10px 0;
}
ion-toolbar::part(content) {
  display: flex;
  justify-content: center;
}

.main-content {
  padding: 1rem;
}
ion-tab-bar {
  background: var(--ion-background-color);
}

ion-fab {
  bottom: 50px;
}

</style>
