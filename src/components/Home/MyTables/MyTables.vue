<script setup lang="ts">
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';
import type { Props, SavedFile, Emits } from './types';

import { useSpreadsheet } from '@/composables/useSpreadsheet';
 
const { files } = defineProps<Props>();
const { jsonToCsv, jsonToXlsx } = useSpreadsheet();
const router = useRouter();
const emit = defineEmits<Emits>();

function formatExportedFileDetails(file: SavedFile) {
  if (!file.exported) {
    return 'Não'
  }

  return `Sim - ${file.recordCount.lines} linhas e ${file.recordCount.columns} colunas`;
}
function downloadFile(file: SavedFile) {
  const link = document.createElement('a');
  link.setAttribute('download', file.fileName);

  if (file.fileName.split('.')[file.fileName.split('.').length - 1] === 'csv') {
    link.href = jsonToCsv(file.data);
  } 
  else {
    jsonToXlsx(file.data, file.fileName);
  }

  link.click();
}
function removeFile(fileIndex: number) {
  const jsonfiles = localStorage.getItem('files');
  if (jsonfiles) {
    let files = JSON.parse(jsonfiles) as Array<SavedFile>;
    localStorage.setItem('files', JSON.stringify([
      ...files.slice(0, fileIndex),
      ...files.slice(fileIndex + 1)
    ]));
    emit('delete');
  }
}
</script>

<template>
  <div class="my-tables">
    <table>
      <tr>
        <th>
          Nome
        </th>
        <th>
          Número de colunas
        </th>
        <th>
          Número de linhas
        </th>
        <th>
          Exportado
        </th>
        <th>
          Criado em
        </th>
        <th>
          Download
        </th>
        <th>
          Excluir
        </th>
      </tr>

      <tr v-for="(file, fileIndex) in files" :key="`file${fileIndex}`" @click="router.push(`/detail/${fileIndex}`)">
        <td>
          {{ file.fileName }}
        </td>
        <td>
          {{ file.data[0].length }} colunas
        </td>
        <td>
          {{ file.data.length }} linhas
        </td>
        <td>
          {{ formatExportedFileDetails(file) }}
        </td>
        <td>
          {{ file.createdAt }}
        </td>
        <td @click.stop="downloadFile(file)">
          <img src="./img/download.svg" width="16" height="16">
        </td>
        <td @click.stop="removeFile(fileIndex)">
          <img src="./img/trash-icon.svg" width="16" height="16">
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
