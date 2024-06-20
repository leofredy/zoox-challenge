<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, toRefs, watch } from 'vue';
import type { SaveFile } from '@/types/file';
import type { Emits, Props } from './types';

import Dialog from '@/components/Base/Dialog/Dialog.vue';
import { useSpreadsheet } from '@/composables/useSpreadsheet';

const props = defineProps<Props>();
const { abortReading, show } = toRefs(props);
const emit = defineEmits<Emits>();

const { csvToJSON, xlsxToJSON } = useSpreadsheet();

const dropAreaDOM = ref<HTMLLabelElement>();

const reader = ref<FileReader>();
watch(abortReading, (newValue) => {
  if (newValue) {
    reader.value?.abort();
    emit('aborted');
  }
})

const router = useRouter();

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
  highlight(
    event.dataTransfer?.items[0].type === 'text/csv' || 
    event.dataTransfer?.items[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
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
  if (file.type === 'text/csv' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
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
          let fileOnJSON: Array<Array<string>>;

          if (file.type === 'text/csv') {
            fileOnJSON = csvToJSON(e.target.result as string);
          }
          else {
            fileOnJSON = xlsxToJSON(e.target.result as ArrayBuffer);
          }

          try {
              save({
                fileName: file.name,
                data: fileOnJSON,
                createdAt: file.lastModified,
                exported: false,
                recordCount: {
                  lines: 0,
                  columns: 0
                }
              });

              const jsonFiles = localStorage.getItem('files');
              if (jsonFiles) {
                const files = (JSON.parse(jsonFiles) as Array<SaveFile>);
                router.push(`/detail/${files.length - 1}`);
              }
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
      if (file.type === 'text/csv') {
        reader.value.readAsText(file);
      }
      else {
        reader.value.readAsArrayBuffer(file);
      }
    })
  }
}
function save(file: SaveFile) {
  const currentFiles = localStorage.getItem('files');
  if (!currentFiles) {
    localStorage.setItem('files', JSON.stringify([file]));
  }
  else {
    localStorage.setItem('files', JSON.stringify([...JSON.parse(currentFiles), file]));
  }
  emit('put');
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
