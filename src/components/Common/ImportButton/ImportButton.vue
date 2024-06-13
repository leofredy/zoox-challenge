<script setup lang="ts">
import { ref } from 'vue';

import Dialog from '@/components/Base/Dialog/Dialog.vue';
import DragArea from '@/components/Base/DragArea/DragArea.vue';

const showDialog = ref(false);
</script>

<template>
  <button @click="showDialog = true" class="import-button">
    <img src="./img/add.svg" width="12" height="12">
    Importar CSV
  </button>
  <Teleport to="body">
    <Dialog :show="showDialog" @close="showDialog = false">
      <div class="dialog__content">
        <p class="dialog__content-title">
          Escolha um arquivo a ser importado
        </p>

        <DragArea />

        <button @click="showDialog = false" class="dialog--cancel-btn">
          Cancelar
        </button>
      </div>
    </Dialog>
  </Teleport>
</template>

<style scoped src="./styles.scoped.css" />
