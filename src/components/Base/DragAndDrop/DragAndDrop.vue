<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Props, Emits,  } from './types';

import Progress from './Progress/Progress.vue';
import { DragArea, type UpdateProgress } from './DragArea';

const { show } = defineProps<Props>();

const emit = defineEmits<Emits>();

const error = ref<boolean>(false);
const abortReading = ref<boolean>(false);
const showProgressModal = ref<boolean>(false);
const fileName = ref<string>('');
const fileSize = ref<number>(0);
const fileLoaded = ref<number>(0);

watch(showProgressModal, (newValue) => {
  if (newValue) {
    emit('close');
  }
  else {
    emit('open');
  }
});

function update(data: UpdateProgress) {
  fileName.value = data.fileName;
  fileSize.value = data.fileSize;
  fileLoaded.value = data.fileLoaded;
  showProgressModal.value = data.showProgressModal;
}
function closeProgressModal() {
  showProgressModal.value = false;
}
function cancelReaderFile() {
  showProgressModal.value = false;
  abortReading.value = true;
}
function readerOtherFile() {
  showProgressModal.value = false;
}
function readerError() {
  showProgressModal.value = false;
  error.value = true;
  setTimeout(() => {
    error.value = false;
  }, 1);
  emit('open');
}
</script>

<template>
  <div class="draganddrop">
    <Teleport to="#teleports">
      <DragArea 
        :show="show" 
        :abort-reading="abortReading" 
        @update="update" 
        @aborted="abortReading = false" 
        @error="readerError"
        @close="emit('close')"
        @put="emit('put')"
      />
    </Teleport>
    

    <!-- PROGRESS MODAL -->
    <Teleport to="#teleports">
      <Progress 
        v-if="!error"
        :filename="fileName" 
        :loaded="fileLoaded" 
        :size="fileSize" 
        :show="showProgressModal" 
        @close="closeProgressModal"
        @other="readerOtherFile"
        @cancel="cancelReaderFile"
      />
    </Teleport>
  </div>
</template>

