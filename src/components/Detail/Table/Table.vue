<script setup lang="ts">
import { defineProps, computed, ref, toRefs, watch } from 'vue';
import type { Props, Emits } from './types';

import Checkbox from '@/components/Base/Checkbox/Checkbox.vue';

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { file } = toRefs(props);


const selectedColumns = computed(() => {
  return file.value.data.map((line) => {
    return {
      ...line,
      columns: line.columns.filter((column) => column.selected)
    }
  });
});
function changeAllLine(status: boolean) {
  emit('update', {
    ...file.value,
    data: file.value.data.map(line => {
      return {
        ...line,
        selected: status,
      }
    })
  });
}
function changeOneLine(lineIndex: number, status: boolean) {
  emit('update', {
    ...file.value,
    data: file.value.data.map((line, index) => {
      return {
        ...line,
        selected: lineIndex === index ? status : line.selected,
      }
    })
  });
}


watch(file, () => {
  tableDOM.value!.style.transform = `translate(0px, 0px)`;
});
const tableDOM = ref<HTMLTableElement>();
const scrollLeft = ref<number>(0);
const scrollTop = ref<number>(0);
const x = ref<number>(0);
const y = ref<number>(0);
function mouseDownEvent(event: MouseEvent) {
  x.value = event.clientX;
  y.value = event.clientY;
  const styles = window.getComputedStyle(tableDOM.value!);
  const matrix = new WebKitCSSMatrix(styles.transform);
  scrollLeft.value = matrix.m41;
  scrollTop.value = matrix.m42;
  tableDOM.value?.parentElement!.addEventListener('mousemove', mousemoveEvent);

  tableDOM.value!.style.cursor = 'grabbing';
}
function mouseUpEvent() {
  tableDOM.value?.parentElement!.removeEventListener('mousemove', mousemoveEvent);
  tableDOM.value!.style.cursor = 'grab';
}
function mouseLeaveEvent() {
  tableDOM.value?.parentElement!.removeEventListener('mousemove', mousemoveEvent);
}
function mousemoveEvent(event: MouseEvent) {
  const { width: parentWidth, height: parentHeight } = tableDOM.value!.parentElement!.getBoundingClientRect();
  const { width: meWidth, height: meHeight } = tableDOM.value!.getBoundingClientRect();


  const newX = scrollLeft.value + (event.clientX - x.value);
  const maxScrollX = ((newX * -1) + parentWidth - meWidth) <= 0;

  const newY = scrollTop.value + (event.clientY - y.value)
  const maxScrollY = ((newY * -1) + parentHeight - meHeight) <= 0;

  tableDOM.value!.style.transform = `translate(
    ${
      meWidth > parentWidth ? 
        newX > 0 ? 
          0 : 
          maxScrollX ? newX : (meWidth - parentWidth) * -1
        : 0
    }px, ${
      meHeight > parentHeight ?
        newY > 0 ? 
          0 :
          maxScrollY ? newY : (meHeight - parentHeight) * -1
        : 0
    }px)`;
  
}
</script>
  
<template>
  <table ref="tableDOM" class="table" @mousedown="mouseDownEvent" @mouseup="mouseUpEvent" @mouseleave="mouseLeaveEvent">
    <tr
      v-for="(line, lineIndex) in selectedColumns"
      :key="`line${lineIndex}`"
    >
      <template v-if="line.isHeader">
        <th class="table__column-checkbox">
          <Checkbox :value="line.selected" @change="changeAllLine" />
        </th>
        <th 
          v-for="(column, columnIndex) in line.columns"
          :key="`column${columnIndex}`"
        >
          {{ column.label }}
        </th>
      </template>
      <template v-else>
        <td class="table__column-checkbox">
          <Checkbox :value="line.selected" @change="(status) => changeOneLine(lineIndex, status)" />
        </td>
        <td
          v-for="(column, columnIndex) in line.columns"
          :key="`column${columnIndex}`"
        >
          {{ column.label }}
        </td>
      </template>
    </tr>
  </table>
</template>

<style scoped src="./styles.scoped.css" />
