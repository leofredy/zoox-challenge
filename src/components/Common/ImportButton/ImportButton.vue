<script setup lang="ts">
import { ref } from 'vue';
import type { Emits } from './types';

import DragAndDrop from '@/components/Base/DragAndDrop/DragAndDrop.vue';

const emit = defineEmits<Emits>();
const showDragAndDrop = ref(false);
</script>

<template>
  <button @click.self="showDragAndDrop = true" class="import-button">
    <img src="./img/add.svg" width="12" height="12">
    Importar CSV
    <DragAndDrop 
      :show="showDragAndDrop" 
      @close="showDragAndDrop = false" 
      @open="showDragAndDrop = true"
      @put="emit('update')"
    />
  </button>

</template>

<style scoped src="./styles.scoped.css" />
