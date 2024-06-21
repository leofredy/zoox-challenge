<script setup lang="ts">
import type { Props, Emits } from './types';

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <label class="switch">
    <input :checked="props.value" type="checkbox" @change="emit('change')">
    <span class="slider" />
  </label>
</template>

<style scoped src="./styles.scoped.css" />
