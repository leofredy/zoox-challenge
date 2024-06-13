<script setup lang="ts">
import { RouterView } from 'vue-router'

import Header from '@/components/App/Header/Header.vue';

</script>

<template>
  <div class="app">
    <Header />
    <RouterView />
  </div>
</template>