<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import type { ViewFile } from './types';
import type { SaveFile } from '@/types/file';

import ExportButton from '@/components/Detail/ExportButton/ExportButton.vue';
import BackButton from '@/components/Detail/BackButton/BackButton.vue';
import { Filter, type Column } from '@/components/Detail/Filter';
import Table from '@/components/Detail/Table/Table.vue';

const route = useRoute();
const loading = ref<boolean>(true);
const file = ref<ViewFile>();
onMounted(() => {
  getFile();
});

function getFile() {
  const stringifyFile = localStorage.getItem('files');
  if (stringifyFile) {
    const files = JSON.parse(stringifyFile) as Array<SaveFile>;
    const slug = route.params.slug as string;

    const foundFile = files.find((f, fIndex) => fIndex === parseInt(slug));
    if (foundFile) {
      file.value = {
        ...foundFile,
        data: [
          ...foundFile.data.map((line, lineIndex) => {
            return { 
              selected: false,
              isHeader: lineIndex === 0,
              columns: line.map((column) => {
                return {
                  selected: true,
                  label: column,
                }
              })
            }
          }) 
        ]
      }
    }
    loading.value = false;
  }
}
function updateViewFile(newViewFile: ViewFile) {
  file.value = newViewFile;
}
function setVisibilityAllColumns(status: boolean) {
  file.value = {
    ...file.value!,
    data: file.value!.data.map(line => {
      return {
        ...line,
        columns: line.columns.map(column => {
          return {
            ...column,
            selected: status
          }
        })
      }
    })
  };
}
function setVisibilityColumn({ index }: Column) {
  file.value = {
    ...file.value!,
    data: file.value!.data.map(line => {
      return {
        ...line,
        columns: line.columns.map((column, columnIndex) => {
          if (columnIndex === index) {
            return {
              ...column,
              selected: !column.selected
            }
          }
          return column;
        })
      }
    })
  };
}
</script>

<template>
  <main class="detail">
    <template v-if="loading">
      loading...
    </template>
    <template v-else-if="!file">
      404 NotFound
    </template>
    <template v-else>
      <div class="row">
        <div class="column">
          <div class="detail__flex-container">
            <div class="detail__top">
              <Filter 
                :file="file" 
                @see-all-columns="setVisibilityAllColumns(true)" 
                @see-nothing-columns="setVisibilityAllColumns(false)" 
                @set-column="setVisibilityColumn"
              />
              <div class="detail__export-and-back">
                <ExportButton :file="file" />
                <BackButton />
              </div>
            </div>
  
            <div class="detail__content">
              <Table class="detail__table" :file="file" @update="updateViewFile" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped src="./styles.scoped.css" />
