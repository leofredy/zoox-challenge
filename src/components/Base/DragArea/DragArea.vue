<script setup lang="ts">
</script>

<template>
  <label for="file" class="drag-area">
    <p class="drag-area__p">Arraste um arquivo CSV, XLSX até aqui</p>
    <p class="drag-area__p">Ou se preferir</p>
    <input id="file" type="file" hidden />
    <button class="drag-area--btn">
      Selecione um arquivo do seu dispositivo
    </button>
  </label>
</template>

<style scoped src="./styles.scoped.css" />
