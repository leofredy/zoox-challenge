<script setup lang="ts">
import { toRefs, computed, } from 'vue';
import type { Props, Emits } from './types';

import Dialog from '@/components/Base/Dialog/Dialog.vue';

const emit = defineEmits<Emits>();
const props = defineProps<Props>();
const { loaded, size, filename, show } = toRefs(props);
const loadedPercentage = computed(() => {
  return ((loaded.value * 100) / size.value);
});

</script>

<template>
  <Dialog @close="emit('close')" :show="show" class="progress">
    <div class="progress__content">
      <p class="progress__title">
        Escolha um arquivo a ser importado
      </p>

      <div class="progress__filename-otherfile">
        <div :title="filename" class="progress__filename">
          <img class="progress__filename-icon" src="./img/file-icon.svg" width="13.62">
          <p class="progress__filename-p">
            {{ filename }}
          </p>
        </div>

        <button @click="emit('other')" class="progress--other-file-btn">
          Selecione outro arquivo
        </button>
      </div>

      <div class="progress__total-line">
        <div :style="{ maxWidth: `${loadedPercentage}%` }" class="progress__current-line" />
      </div>

      <p class="progress__total-p">
        Envio do arquivo: 
        <b>
          {{ loadedPercentage }}%
        </b>
      </p>

      <button class="progress--cancel-btn" @click="emit('cancel')">
        Cancelar
      </button>
    </div>
  </Dialog>
</template>

<style scoped src="./styles.scoped.css" />
