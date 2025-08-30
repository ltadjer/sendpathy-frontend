<template>
  <div v-if="hasFilters">
    <ion-button @click="openModal">
      <ion-icon :icon="filterOutline"></ion-icon>
    </ion-button>
    <post-filter-modal
      :is-open="isModalOpen"
      @close="closeModal"
      @update:selectedTags="updateSelectedTags"
      @update:selectedTriggers="updateSelectedTriggers"
    >
    </post-filter-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonButton, IonIcon } from '@ionic/vue'
import { filterOutline } from 'ionicons/icons'
import PostFilterModal from './PostFilterModal.vue'
import { useTagStore } from '@/stores/tag'
import { useTriggerStore } from '@/stores/trigger'

export default defineComponent({
  name: 'FilterButton',
  components: {
    IonButton,
    IonIcon,
    PostFilterModal
  },
  computed: {
    hasFilters() {
      return this.tagStore.tags.length > 0 || this.triggerStore.triggers.length > 0
    }
  },
  setup() {
    const tagStore = useTagStore()
    const triggerStore = useTriggerStore()

    return { filterOutline, tagStore, triggerStore }
  },
  data() {
    return {
      isModalOpen: false,
      selectedTags: [] as number[],
      selectedTriggers: [] as number[]
    }
  },
  methods: {
    openModal() {
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
    },
    updateSelectedTags(tags) {
      this.selectedTags = tags
      this.$emit('update:selectedTags', tags)
    },
    updateSelectedTriggers(triggers) {
      this.selectedTriggers = triggers
      this.$emit('update:selectedTriggers', triggers)
    }
  }
})
</script>
