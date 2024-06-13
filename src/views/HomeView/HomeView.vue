<script setup lang="ts">
import ImportButton from '@/components/Common/ImportButton/ImportButton.vue';
</script>

<template>
  <main class="home">
    <div class="row">
      <div class="column">
        <div class="home__top">
          <h1 class="home__title">
            Seus Arquivos 
          </h1>

          <ImportButton />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped src="./styles.scoped.css" />
