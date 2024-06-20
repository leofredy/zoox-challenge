<script setup lang="ts">
import { ref } from 'vue';

import DragAndDrop from '@/components/Base/DragAndDrop/DragAndDrop.vue';

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
    />
  </button>

</template>

<style scoped src="./styles.scoped.css" />
