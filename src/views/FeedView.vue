<template>
  <ion-page>
    <MainHeader
      title="Feed"
      :showAvatar="true"
      :avatarSrc="currentUser?.avatar"
      @avatar-click="showUserProfile(currentUser)"
      :showEndButtons="true"
    >
      <template #end-buttons>
        <ion-icon
          class="custom-icon ion-margin-end"
          :icon="notificationsOutline"
          @click="goToNotifications"
        ></ion-icon>
        <ion-icon
          class="custom-icon ion-margin-end"
          @click="startTour"
          :icon="helpOutline"
        ></ion-icon>
      </template>
    </MainHeader>
    <ion-content>
      <div v-if="isDesktop">
        <post-form :current-user="currentUser" @post-updated="refreshPosts" />
      </div>
      <post-list :posts="posts" :current-user="currentUser" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PostList from '@/components/Feed/PostList.vue'
import { usePostStore } from '@/stores/post'
import { useAccountStore } from '@/stores/account'
import { IonPage, IonContent, IonIcon } from '@ionic/vue'
import { notificationsOutline, helpOutline } from 'ionicons/icons'
import MainHeader from '@/components/Common/MainHeader.vue'
import PostForm from '@/components/Feed/PostForm.vue'
import { onMounted } from 'vue'
import { createTour } from '@/utils/tour'

export default defineComponent({
  name: 'FeedView',
  components: {
    PostForm,
    IonIcon,
    PostList,
    IonPage,
    IonContent,
    MainHeader
  },
  data() {
    return {
      isUserProfileModalOpen: false
    }
  },
  setup() {
    onMounted(() => {
      const seen = localStorage.getItem('appTourSeen')
      if (!seen) {
        const tour = createTour()
        tour.start()
        localStorage.setItem('appTourSeen', 'yes')
      }
    })
    return {
      notificationsOutline,
      helpOutline
    }
  },
  async created() {
    await usePostStore().fetchAllPosts()
  },
  computed: {
    posts() {
      return usePostStore()
        .posts.slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
    currentUser() {
      return useAccountStore().user
    },
    isDesktop() {
      return window.innerWidth > 1200
    }
  },
  methods: {
    showUserProfile(user) {
      this.$router.push({ name: 'UserProfile', params: { userId: user.id } })
    },
    goToNotifications() {
      this.$router.push('/notifications')
    },
    startTour() {
      const tour = createTour()
      tour.start()
    }
  }
})
</script>
<style scoped>
@media (min-width: 1024px) {
  ion-router-outlet .ion-page {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ion-content {
    width: 90%;
  }
}

.custom-icon:nth-child(2) {
  font-size: 1rem;
}
</style>
