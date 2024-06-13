<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useBreadcrumb } from '@/composables/useBreadcrumb';

const { breadcrumb } = useBreadcrumb();
</script>

<template>
  <header class="header">
    <div class="header__breadcrumb row column">
      <div 
        v-for="(breadcrumbItem, breadcrumbItemIndex) in breadcrumb"
        :key="breadcrumbItemIndex"
        class="header__breadcrumb-item"
      >
        <RouterLink :to="breadcrumbItem.path" class="header--breadcrumb-link">
          {{ breadcrumbItem.label }}
        </RouterLink>

        <img 
          v-if="!breadcrumbItem.current" 
          src="./img/arrow.svg" 
          width="16" 
          height="16"
        >
      </div>
    </div>
  </header>
</template>

<style scoped src="./styles.scoped.css" />
