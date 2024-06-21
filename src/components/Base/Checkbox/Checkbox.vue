<script setup lang="ts">
import { defineProps } from 'vue';
import type { Props, Emits } from './types';

const { value } = defineProps<Props>();
const emit = defineEmits<Emits>();

</script>

<template>
  <label class="checkbox">
    <input :checked="value" type="checkbox" @change="emit('change', !value)">
    <img src="./img/checked-icon.svg">
  </label>
</template>

<style scoped src="./styles.scoped.css" />
