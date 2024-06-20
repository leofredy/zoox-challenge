<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import type { Emits, SaveFile, Props } from './types';

import Dialog from '@/components/Base/Dialog/Dialog.vue';

const props = defineProps<Props>();
const { abortReading, show } = toRefs(props);
const emit = defineEmits<Emits>();

const dropAreaDOM = ref<HTMLLabelElement>();

const reader = ref<FileReader>();
watch(abortReading, (newValue) => {
  if (newValue) {
    reader.value?.abort();
    emit('aborted');
  }
})

async function changeInput(event: Event) {
  const inputDOM = (event.target as HTMLInputElement);
  const files = inputDOM.files;
  if (files?.length) {
    await readFile(files[0]);
    inputDOM.value = '';
  }
}
function dropEvent(event: DragEvent) {
  unhighlight();
  if (event.dataTransfer?.files) {
    readFile(event.dataTransfer.files[0]);
  }
}
function dragEnterEvent(event: DragEvent) {
  highlight(event.dataTransfer?.items[0].type === 'text/csv');
}
function dragLeaveEvent() {
  unhighlight();
}
function unhighlight() {
  dropAreaDOM.value?.classList.remove('valid-highlight');
  dropAreaDOM.value?.classList.remove('invalid-highlight');
}
function highlight(status: boolean) {
  status ? dropAreaDOM.value?.classList.add('valid-highlight') : dropAreaDOM.value?.classList.add('invalid-highlight')
}
async function readFile(file: File): Promise<void> {
  if (file.type === 'text/csv') {
    emit('update', {
      fileName: file.name,
      fileSize: file.size,
      fileLoaded: 0,
      showProgressModal: true
    });
    
    await new Promise((resolve) => {
      reader.value = new FileReader();
      reader.value.onload = (e) => {
        if (e.target?.result) {

          const csvOnJSON = csvToJSON(e.target.result as string);

          try {
            save({
              fileName: file.name,
              data: csvOnJSON,
              createdAt: file.lastModified
            });
          } catch(e) {
            emit('error');
            if (e instanceof DOMException) {
              if (e.name === 'QuotaExceededError') {
                if (confirm('Você consumiu 100% de seu espaço, limpe e faça o upload novamente. Deseja limpar?')) {
                  localStorage.removeItem('files');
                }
              } 
            }
          }
        }

        resolve(e);
      }
      reader.value.onprogress = ({ loaded }) => {
        emit('update', {
          fileLoaded: loaded,
          fileName: file.name,
          fileSize: file.size,
          showProgressModal: true
        });
      }
      reader.value.readAsText(file);
    })
  }
}
function csvToJSON(stringFile: string) {
  const lines = stringFile.split("\r" + "\n")
  const table = lines.map(line => line.split(','))
  return table;
}
function save(file: SaveFile) {
  const currentFiles = localStorage.getItem('files');
  if (!currentFiles) {
    localStorage.setItem('files', JSON.stringify([file]));
  }
  else {
    localStorage.setItem('files', JSON.stringify([...currentFiles, file]));
  }
}
</script>

<template>
  <Dialog @close="emit('close')" :show="show" class="drag-area__modal">
    <div class="drag-area">
      <p class="drag-area__title">
        Escolha um arquivo a ser importado
      </p>

      <label 
        ref="dropAreaDOM" 
        for="file" 
        class="drag-area__container"
        @dragenter="dragEnterEvent"
        @dragleave="dragLeaveEvent"
        @drop.prevent="dropEvent"
        @dragover.prevent=""
      >
        <p class="drag-area__p">Arraste um arquivo CSV, XLSX até aqui</p>
        <p class="drag-area__p">Ou se preferir</p>
        <input 
          id="file" 
          type="file" 
          hidden 
          accept=".csv, .xlsx" 
          @change="changeInput"
        />
        <button class="drag-area--btn">
          Selecione um arquivo do seu dispositivo
        </button>
      </label>

      <button @click="emit('close')" class="drag-area--cancel-btn">
        Cancelar
      </button>
    </div>
  </Dialog>
</template>

<style scoped src="./styles.scoped.css" />
