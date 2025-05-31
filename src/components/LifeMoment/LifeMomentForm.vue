<template>
  <ion-card>
    <ion-card-content>
      <form @submit.prevent="submitLifeMoment">
        <span style="font-size: 2rem;">{{emotion}}</span>
        <div
            v-if="contents.length"
            :class="`media-grid media-count-${contents.length}`"
        >
          <div
              v-for="(content, index) in displayedContents"
              :key="index"
              class="media-item"
          >
            <div v-if="content.type.startsWith('image/')">
              <img
                  :src="`${content.fileUrl}`"
                  alt="Image"
                  class="media-content"
              />
              <ion-buttons class="delete-icon">
                <custom-button
                    @button-click="deleteOneContent(content, index)"
                    :icon="closeOutline"
                ></custom-button>
              </ion-buttons>
            </div>
            <div v-else-if="content.type.startsWith('video/')">
              <video
                  :src="`${content.fileUrl}`"
                  controls
                  class="media-content"
              ></video>
              <ion-icon
                  name="close-circle"
                  class="delete-icon"
                  @click="deleteOneContent(index)"
              ></ion-icon>
            </div>
            <div v-else-if="content.type.startsWith('audio/')">
              <video
                  :src="`${content.fileUrl}`"
                  controls
                  class="media-content"
              ></video>
              <ion-icon
                  name="close-circle"
                  class="delete-icon"
                  @click="deleteOneContent(index)"
              ></ion-icon>
            </div>
          </div>
        </div>
        <div v-if="contents.length > 2" class="see-more-container">
          <custom-button
              :text="showAllMedia ? 'Voir moins' : 'Voir plus'"
              @click="toggleShowAll"
              class="see-more-button"
          ></custom-button>
        </div>
        <ion-item class="ion-no-shadow" lines="none">
          <ion-textarea
              v-model="content"
              placeholder="Comment te sens-tu aujourd'hui?"
              class="custom-textarea"
              rows="5"
          ></ion-textarea>
        </ion-item>
        <ion-grid>
          <ion-row>
            <ion-col size="8">
              <custom-button
                  :icon="happyOutline"
                  @click="openEmojiModal"
              ></custom-button>
              <custom-button
                  :icon="imageOutline"
                  @click="triggerFileInput"
              ></custom-button>
              <input
                  type="file"
                  ref="fileInput"
                  @change="onFileChange"
                  accept="image/*,video/*,audio/*"
                  multiple
                  style="display: none;"
              />
              <custom-button
                  :icon="isRecording ? stopOutline : micOutline"
                  @click="toggleRecording"
              ></custom-button>
            </ion-col>
            <ion-col size="4" class="ion-text-end">
              <custom-button text="Partager" type="submit"></custom-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </ion-card-content>
  </ion-card>

  <emotions-modal
      :isOpen="isEmojiModalOpen"
      @update:isOpen="isEmojiModalOpen = $event"
      @emoji-selected="updateEmotion"
      :selected-emoji="emotion"
  ></emotions-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButtons
} from '@ionic/vue';
import {
  happyOutline,
  imageOutline,
  micOutline,
  stopOutline,
  closeOutline
} from 'ionicons/icons';
import CustomButton from '@/components/Commun/CustomButton.vue';
import EmotionsModal from '@/components/Commun/EmotionsModal.vue';
import { useLifeMomentStore } from '@/stores/life-moment';

export default defineComponent({
  name: 'LifeMomentForm',
  components: {
    IonCol,
    CustomButton,
    IonCard,
    IonCardContent,
    IonItem,
    IonTextarea,
    EmotionsModal,
    IonGrid,
    IonRow,
    IonIcon,
    IonButtons
  },
  props: {
    lifeMoment: Object
  },
  data() {
    return {
      content: '',
      emotion: '',
      file: null,
      base64Image: '',
      isRecording: false,
      audioBlob: null,
      mediaRecorder: null,
      isEmojiModalOpen: false,
      contents: [],
      isFileInputTriggered: false,
      apiUrl: import.meta.env.VITE_API_URL,
      showAllMedia: false, // Contrôle l’affichage de toutes les images ou juste 2
    };
  },
  computed: {
    displayedContents() {
      if (this.showAllMedia || this.contents.length <= 2) {
        return this.contents;
      }
      return this.contents.slice(0, 2);
    }
  },
  watch: {
    lifeMoment: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.content = newVal.content;
          this.emotion = newVal.emotion;
          this.contents = newVal.contents || [];
        } else {
          this.resetForm();
        }
      }
    }
  },
  setup() {
    return { happyOutline, imageOutline, micOutline, stopOutline, closeOutline };
  },
  emits: ['close', 'button-click'],
  methods: {
    triggerFileInput() {
      if (!this.isFileInputTriggered && this.$refs.fileInput) {
        this.isFileInputTriggered = true;
        this.$refs.fileInput.click();
      }
    },
    onFileChange(event) {
      this.isFileInputTriggered = false;
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (this.validateFile(file)) {
          this.getFileBase64(file).then(base64 => {
            this.contents.push({
              type: file.type,
              content: '',
              base64Content: base64,
              originalName: file.name,
              size: file.size,
              order: this.contents.length + 1
            });
          });
        }
      });
      // Pour permettre de re-sélectionner les mêmes fichiers
      event.target.value = null;
    },
    validateFile(file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'video/mp4', 'audio/mpeg'];
      const maxSize = 10 * 1024 * 1024; // 10 MB

      if (!allowedTypes.includes(file.type)) {
        alert('Type de fichier invalide');
        return false;
      }
      if (file.size > maxSize) {
        alert('Le fichier dépasse la taille maximale de 10 MB');
        return false;
      }
      return true;
    },
    getFileBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Content = (reader.result as string).split(',')[1];
          resolve(base64Content);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    getImageUrl(content) {
      if (content.fileUrl && content.fileUrl.startsWith('/uploads')) {
        return `${import.meta.env.VITE_API_URL}${content.fileUrl}`;
      }
      return `data:${content.type};base64,${content.base64Content}`;
    },
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    },
    startRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.isRecording = true;

        const audioChunks: BlobPart[] = [];
        this.mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data);
        });
        this.mediaRecorder.addEventListener('stop', () => {
          this.audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        });
      });
    },
    stopRecording() {
      this.mediaRecorder?.stop();
      this.isRecording = false;
    },
    updateEmotion(emoji) {
      this.emotion = emoji;
    },
    openEmojiModal() {
      this.isEmojiModalOpen = true;
    },
    async deleteOneContent(contentOrIndex: any, maybeIndex?: number) {
      // Si contentOrIndex est un objet avec un id, on appelle l’API
      if (contentOrIndex.id) {
        await useLifeMomentStore().deleteOneContent(contentOrIndex.id);
        const updated = await useLifeMomentStore().fetchOneLifeMomentById(this.lifeMoment.id);
        this.contents = updated.contents;
      } else {
        // Sinon, suppression locale
        this.contents.splice(maybeIndex!, 1);
      }
    },
    async submitLifeMoment() {
      const formData = {
        content: this.content,
        emotion: this.emotion || '',
        contents: this.contents || []
      };

      if (this.lifeMoment && this.lifeMoment.id) {
        await useLifeMomentStore().updateOneLifeMoment(this.lifeMoment.id, formData);
      } else {
        await useLifeMomentStore().createOneLifeMoment(formData);
      }

      this.resetForm();
      this.$emit('close');
    },
    resetForm() {
      this.content = '';
      this.file = null;
      this.base64Image = '';
      this.isRecording = false;
      this.audioBlob = null;
      this.mediaRecorder = null;
      this.emotion = '';
      this.contents = [];
      this.showAllMedia = false;
    },
    toggleShowAll() {
      this.showAllMedia = !this.showAllMedia;
    }
  }
});
</script>

<style scoped>
ion-item {
  --padding-start: 0px;
  --inner-padding-end: 0px;
}

.custom-textarea {
  background-image: url('/img/fond-sendpathy.svg');
  background-size: cover;
  background-position: center;
  height: 300px;
  resize: none;
  padding: 1rem;
}

.media-grid {
  display: grid;
  gap: 8px;
  width: 100%;
}
.media-count-1 {
  grid-template-columns: 1fr;
}

.media-count-2,
.media-count-3,
.media-count-4,
.media-count-5,
.media-count-6,
.media-count-7,
.media-count-8,
.media-count-9,
.media-count-10 {
  grid-template-columns: repeat(2, 1fr);
}

.media-count-3 {
  grid-template-rows: auto auto;
}

.media-count-4,
.media-count-5 {
  grid-template-rows: 1fr 1fr;
}

.media-item {
  position: relative;
}
.media-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: var(--neumorphism-out-shadow);
  padding: 6px;
}

.media-content img {
  border-radius: 1rem;
}

.delete-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

/* Styles pour le bouton « Voir plus » */
.see-more-container {
  margin-top: 8px;
  text-align: center;
}
.see-more-button {
  /* Ajoutez ici vos styles si besoin (padding, couleur de fond, etc.) */
}
</style>
