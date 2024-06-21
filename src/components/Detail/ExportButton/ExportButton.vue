<script setup lang="ts">
import { defineProps, computed, toRefs } from 'vue';
import type { Props } from './types';

import { useSpreadsheet } from '@/composables/useSpreadsheet';

const props = defineProps<Props>();
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

const { jsonToCsv, jsonToXlsx } = useSpreadsheet();
function downloadFile() {
  const link = document.createElement('a');
  link.setAttribute('download', file.value.fileName);

  if (file.value.fileName.split('.')[file.value.fileName.split('.').length - 1] === 'csv') {
    link.href = jsonToCsv(selectedLinesAndColumns.value);
  } 
  else {
    jsonToXlsx(selectedLinesAndColumns.value, file.value.fileName);
  }

  link.click();
}
</script>

<template>
  <button class="export-button" @click="downloadFile">
    <img src="./img/export.svg" width="12" height="12">
    Exportar tabela
  </button>
</template>

<style scoped src="./styles.scoped.css" />
