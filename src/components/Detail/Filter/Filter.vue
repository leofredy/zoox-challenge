<script setup lang="ts">
import { defineProps, computed, toRefs, ref } from 'vue';
import type { Props, Emits } from './types';

import ToggleSwitch from '@/components/Base/ToggleSwitch/ToggleSwitch.vue';

const props = defineProps<Props>();
const { file } = toRefs(props);
const showFilterOptions = ref<boolean>(false);
const emit = defineEmits<Emits>();
const columns = computed(() => {
  return file.value.data[0].columns;
});
</script>

<template>
  <div class="filter">
    <button class="filter--btn" @click="showFilterOptions = !showFilterOptions">
      <img src="./img/column.svg" width="12" height="12">
      Colunas
    </button>

    <div v-if="showFilterOptions" class="filter__options">
      <div class="filter__fixed-options">
        <button class=filter--see-all-btn @click="emit('seeAllColumns')">
          <img src="./img/option-icon.svg" width="16" height="16">
          Mostrar todas as Colunas
        </button>
        <button class="filter--see-nothing-btn" @click="emit('seeNothingColumns')">
          <img src="./img/option-icon.svg" width="16" height="16">
          Esconder todas as Colunas
        </button>
      </div>

      <div v-if="columns.length" class="filter__column-options">
        <div 
          v-for="(column, columnIndex) in columns"
          :key="`column${columnIndex}`"
          class="filter__column-option"
        >
          <div class="filter__column-label">
            <img src="./img/option-icon.svg" width="16" height="16">
            {{ column.label }}
          </div>

          <ToggleSwitch :value="column.selected" @change="(value) => emit('setColumn', { index: columnIndex })" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
