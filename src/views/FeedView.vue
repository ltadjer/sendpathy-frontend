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
        <ion-icon class="custom-icon ion-margin-end" :icon="notificationsOutline" @click="goToNotifications"></ion-icon>
      </template>
    </MainHeader>
    <ion-content>
      <post-list :posts="posts" :current-user="currentUser"/>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PostList from '@/components/Feed/PostList.vue';
import { usePostStore } from '@/stores/post';
import { useAccountStore } from '@/stores/account';
import { IonPage, IonContent, IonIcon } from '@ionic/vue';
import { notificationsOutline } from 'ionicons/icons';
import MainHeader from '@/components/Commun/MainHeader.vue';

export default defineComponent({
  name: 'FeedView',
  components: {
    IonIcon,
    PostList,
    IonPage,
    IonContent,
    MainHeader
  },
  data() {
    return {
      isUserProfileModalOpen: false,
    };
  },
  setup() {
    return {
      notificationsOutline
    };
  },
  async created() {
    await usePostStore().fetchAllPosts();
  },
  computed: {
    posts() {
      return usePostStore().posts.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    currentUser() {
      return useAccountStore().user;
    },
  },
  watch: {
    posts: {
      handler: async function () {
        await this.$nextTick(); // Attendre que le DOM soit mis à jour
        const postContents = document.querySelectorAll('.post-content'); // Ciblez les contenus des posts
        postContents.forEach((content) => {
          const textarea = content.querySelector('textarea');
          if(textarea) {
            textarea.setAttribute('translate', 'yes'); // Indique que cet élément doit être traduit
          }
        });
      },
      deep: true,
    },
  },
  methods: {
    showUserProfile(user) {
      this.$router.push({ name: 'UserProfile', params: { userId: user.id } });
    },
    goToNotifications() {
      this.$router.push('/notifications');
    }
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