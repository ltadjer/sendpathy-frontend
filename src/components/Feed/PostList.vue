<template>
      <post-form-modal v-if="isPostFormModalOpen" @close="closePostFormModal" :post="selectedPost" :current-user="currentUser" />
      <ion-list class="ion-padding">
        <template v-if="posts && posts.length > 0">
        <post-filter-button v-if="$route.fullPath.includes('feed')" class="ion-margin-bottom ion-text-end" @update:selectedTags="updateSelectedTags" @update:selectedTriggers="updateSelectedTriggers"></post-filter-button>

        <ion-item
          class="ion-margin-bottom"
          lines="none"
          v-for="post in paginatedPosts"
          :key="post.id"
          @click.stop="editPost(post)"
        >
          <ion-grid>
            <ion-row>
              <ion-col size="10">
                <ion-list v-if="post.tags && post.tags.length > 0 || post.triggers && post.triggers.length > 0" class="ion-padding-bottom">
                  <ion-chip v-for="element in [...post.tags, ...post.triggers]" :key="element.id" class="ion-margin-top">
                    <span class="gradient-text">{{ element.name }}</span>
                  </ion-chip>
                </ion-list>
                <ion-item lines="none" class="ion-no-shadow ion-align-items-start">
                  <div class="avatar-container" @click.stop="showUserProfile(post.user)">
                    <ion-avatar slot="start">
                      <img alt="User Avatar" :src="post.user.avatar" />
                    </ion-avatar>
                  </div>
                  <div class="ion-padding-top">
                    <ion-text>
                      {{ post.user.username }}
                      <span>{{ post.emotion }}</span>
                    </ion-text>
                    <p>
                      <ion-text
                        class="ion-margin-top post-content"
                        :auto-grow="true"
                      >
                        {{ post.content }}
                      </ion-text>
                    </p>
                  </div>
                </ion-item>
              </ion-col>
              <ion-col size="2" class="ion-text-end">
                <ion-icon class="custom-icon"
                          :id="'popover-button-' + post.id"
                          @click.stop
                          :icon="ellipsisVerticalOutline">
                </ion-icon>
                <ion-popover
                  :trigger="'popover-button-' + post.id"
                  :dismiss-on-select="true"
                  side="top"
                  alignment="end">
                  <ion-list>
                    <ion-item lines="none" :button="true" :detail="false" v-if="post.user.id === currentUser.id" @click.stop="deleteOnePost(post.id)">Supprimer</ion-item>
                    <ion-item lines="none" :button="true" :detail="false" @click="reportPost(post.id)">Signaler</ion-item>
                  </ion-list>
                </ion-popover>

              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="auto">
                <ion-icon class="custom-icon" @click.stop="openCommentModal(post.id)" :icon="chatbubbleOutline"></ion-icon>
                <span v-if="post.comments">{{ post.comments.length }}</span>
              </ion-col>
              <ion-col size="auto">
                <ion-icon class="custom-icon" @click.stop="toggleLike(post)" :icon="post.isLiked ? heart : heartOutline"></ion-icon>
                <span v-if="post.likes">{{ post.likes.length }}</span>
              </ion-col>
              <ion-col class="ion-text-end">
                <ion-text>{{ timeSince(post.createdAt) }}</ion-text>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
          <ion-infinite-scroll threshold="100px" @ionInfinite="loadMorePosts">
            <ion-infinite-scroll-content loading-spinner="bubbles">
            </ion-infinite-scroll-content>
          </ion-infinite-scroll>
        <post-comment-modal v-if="isCommentModalOpen" :comments="comments" @close="closeCommentModal" :post-id="selectedPostId" :current-user="currentUser"></post-comment-modal>
        </template>
        <template v-else>
          <ion-item lines="none" class="no-posts">
            <ion-grid>
              <ion-row class="ion-justify-content-center">
                <ion-col size="12">
                  <ion-label>
                    <h2 class="font-bold">Pas encore de posts</h2>
                    <p>Exprimez ce que vous ressentez, anonymement et en toute liberté. Votre voix compte ici.</p>
                  </ion-label>
                </ion-col>
              </ion-row>
              <ion-row class="ion-justify-content-center">
                <ion-col size="12" class="ion-text-center">
                  <custom-button expand="block" @click="openPostForm" text="Ajouter un post">
                  </custom-button>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>
        </template>
      </ion-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonList, IonItem, IonIcon, IonAvatar, IonGrid, IonCol, IonRow, IonText, IonPopover, IonChip, IonLabel,IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import PostFormModal from '@/components/Feed/PostFormModal.vue';
import PostCommentModal from '@/components/Feed/PostCommentModal.vue';
import { chatbubbleOutline, heart, heartOutline, trashOutline, ellipsisVerticalOutline } from 'ionicons/icons';
import { usePostStore } from '@/stores/post';
import PostFilterButton from '@/components/Feed/PostFilterButton.vue';
import { timeSince } from '@/utils/date';
import CustomButton from "@/components/Commun/CustomButton.vue";

export default defineComponent({
  name: 'PostList',
  components: {
    CustomButton,
    PostFormModal,
    PostFilterButton,
    IonList,
    IonItem,
    IonIcon,
    IonAvatar,
    IonGrid,
    IonCol,
    IonRow,
    IonText,
    IonPopover,
    IonChip,
    IonLabel,
    PostCommentModal,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  },
  setup() {
    return { chatbubbleOutline, heart, heartOutline, trashOutline, ellipsisVerticalOutline };
  },
  data() {
    return {
      selectedPostId: null,
      isCommentModalOpen: false,
      isPostFormModalOpen: false,
      selectedTags: [],
      selectedTriggers: [],
      currentPage: 1,
      postsPerPage: 10,
    };
  },
  props: {
    posts: {
      type: Array,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    }
  },
  computed: {
    selectedPost() {
      const postStore = usePostStore();
      return postStore.posts.find(post => post.id === this.selectedPostId);
    },
    comments() {
      return this.selectedPost ? this.selectedPost.comments.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
    },
    filteredPosts() {
      return this.posts.filter(post => {
        const hasSelectedTags = this.selectedTags.length === 0 || post.tags.some(tag => this.selectedTags.includes(tag.id));
        const hasSelectedTriggers = this.selectedTriggers.length === 0 || post.triggers.some(trigger => this.selectedTriggers.includes(trigger.id));
        return hasSelectedTags && hasSelectedTriggers;
      });
    },
    paginatedPosts() {
      return this.posts.slice(0, this.currentPage * this.postsPerPage);
    },
  },
  methods: {
    timeSince,
    editPost(post) {
      this.selectedPostId = post.id;
      this.isPostFormModalOpen = true;
    },
    async deleteOnePost(postId) {
      await usePostStore().deleteOnePost(postId);
    },
    async reportPost(postId) {
      // Add your report post logic here
      console.log(`Reported post with id: ${postId}`);
    },
    openCommentModal(postId) {
      this.selectedPostId = postId;
      this.isCommentModalOpen = true;
    },
    closeCommentModal() {
      this.isCommentModalOpen = false;
      this.selectedPostId = null;
    },
    async toggleLike(post) {
      if (post.isLiked) {
        await usePostStore().unlikePost(post.id);
        post.isLiked = false;
      } else {
        await usePostStore().likePost(post.id);
        post.isLiked = true;
      }
    },
    closePostFormModal() {
      this.isPostFormModalOpen = false;
      this.selectedPostId = null;
    },
    openPostForm() {
      this.isPostFormModalOpen = true;
    },
    updateSelectedTags(tags) {
      this.selectedTags = tags;
    },
    updateSelectedTriggers(triggers) {
      this.selectedTriggers = triggers;
    },
    showUserProfile(user) {
      this.$router.push({ name: 'UserProfile', params: { userId: user.id } });
    },
    loadMorePosts(event) {
      setTimeout(() => {
        // Check if all posts are loaded
        if (this.paginatedPosts.length >= this.posts.length) {
          event.target.disabled = true; // Disable infinite scroll
        }
        event.target.complete(); // Complete the event

        // Increment the page if more posts are available
        if (this.paginatedPosts.length < this.posts.length) {
          this.currentPage++;
        }
      }, 1000); // Simulate loading delay
    }
  },
});
</script>

<style scoped>
ion-grid {
  padding: 1rem;
}

ion-item:not(ion-popover ion-item):not(.no-posts) {
  --padding-start: 0px;
  --inner-padding-end: 0px;
}

ion-popover ion-list {
  box-shadow: var(--neumorphism-out-shadow) !important;
}

ion-popover ion-item button:hover {
  --box-shadow: var(--neumorphism-in-shadow) !important;
  color: var(--ion-color-primary) !important;
  font-weight: bold;
}
</style>