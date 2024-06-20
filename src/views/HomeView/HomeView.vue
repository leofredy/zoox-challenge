<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { SaveFile } from '@/types/file';

import ImportButton from '@/components/Common/ImportButton/ImportButton.vue';
import NoTables from '@/components/Home/NoTables/NoTables.vue';
import MyTables from '@/components/Home/MyTables/MyTables.vue';

const files = ref<Array<SaveFile | never>>([]);

onMounted(() => {
  getFiles();
});

function getFiles() {
  const stringifyFile = localStorage.getItem('files');
  if (stringifyFile) {
    files.value = JSON.parse(stringifyFile);
  }
}
function deleteFile() {
  getFiles();
}
</script>

<template>
  <main class="home">
    <div class="row">
      <div class="column">
        <div class="home__container-flex">
          <div class="home__top">
            <h1 class="home__title">
              Seus Arquivos 
            </h1>
  
            <ImportButton @update="getFiles" />
          </div>
  
          <div class="home__content">
            <MyTables v-if="files.length" :files="files" class="home__my-files" @delete="deleteFile" />
            <NoTables v-else class="home__no-tables"/>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped src="./styles.scoped.css" />
