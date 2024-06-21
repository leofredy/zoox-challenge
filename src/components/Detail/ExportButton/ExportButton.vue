<script setup lang="ts">
import { computed, toRefs, ref } from 'vue';
import type { Props } from './types';

import Dialog from '@/components/Base/Dialog/Dialog.vue';

import { useSpreadsheet } from '@/composables/useSpreadsheet';
import type { SaveFile } from '@/types/file';

const props = defineProps<Props>();
const confirmExport = ref<boolean>(false);
const { file } = toRefs(props);
const selectedLinesAndColumns = computed(() => {
  return file.value.data
  .map(line => {
    return {
      ...line,
      columns: line.columns.filter(column => {
        return column.selected
      })
    }
  })
  .filter((line) => {
    return line.isHeader || line.selected;
  })
  .map(line => {
    return line.columns.map(column => column.label)
  });
});

const hasLineAndColumns = computed(() => {
  if (selectedLinesAndColumns.value.length > 1) {
    return selectedLinesAndColumns.value[0].length;
  }
  return false;
});

const { jsonToCsv, jsonToXlsx } = useSpreadsheet();
function downloadFile() {
  confirmExport.value = false;
  const link = document.createElement('a');
  link.setAttribute('download', file.value.fileName);

  if (file.value.fileName.split('.')[file.value.fileName.split('.').length - 1] === 'csv') {
    link.href = jsonToCsv(selectedLinesAndColumns.value);
  } 
  else {
    jsonToXlsx(selectedLinesAndColumns.value, file.value.fileName);
  }

  link.click();


  const jsonfiles = localStorage.getItem('files');
  const files = JSON.parse(jsonfiles!) as Array<SaveFile>;
  const lines = selectedLinesAndColumns.value.length;
  const columns = selectedLinesAndColumns.value[0].length;
  const updateFiles = files.map((f, fIndex) => {
    return { 
      ...f, 
      exported: fIndex === file.value.id,
      recordCount: {
        ...f.recordCount,
        columns,
        lines
      }
    }
  });
  localStorage.setItem('files', JSON.stringify(updateFiles));
  
}
</script>

<template>
  <button class="export-button" :disabled="!hasLineAndColumns" @click="confirmExport = true">
    <img src="./img/export.svg" width="12" height="12">
    Exportar tabela

    <Teleport to="#teleports">
      <Dialog :show="confirmExport" class="export-confirm" @close="confirmExport = false">
        <div class="export-confirm__content">
          <p class="export-confirm__title">
            Deseja exportar e baixar a tabela?
          </p>

          <div class="export-confirm__buttons">
            <button @click="confirmExport = false" class="export-confirm--cancel-btn">
              Cancelar
            </button>
            <button @click="downloadFile" class="export-confirm--yes" >
              Sim
            </button>
          </div>
        </div>
      </Dialog>
    </Teleport>
  </button>
</template>

<style scoped src="./styles.scoped.css" />
