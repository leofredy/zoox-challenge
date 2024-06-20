<script setup lang="ts">
import { ref, watch, toRefs } from 'vue';

import type { Emits, Props } from './types';

const props = defineProps<Props>();
const { show } = toRefs(props);

const showBaseModal = ref<boolean>(false);
const showContent = ref<boolean>(false);

watch(show, (newValue) => {
  showBaseModal.value = newValue;
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
});

const emit = defineEmits<Emits>();

function afterEnterBaseModal() {
  showContent.value = true;
}
function afterLeaveBaseModal() {
  emit('close');
}

function afterLeaveContent() {
  showBaseModal.value = false;
}
</script>
<template>
  <Transition
    name="fade"
    @after-enter="afterEnterBaseModal"
    @after-leave="afterLeaveBaseModal"
  >
    <div v-show="showBaseModal" class="dialog force-fill">
      <Transition name="fade" @after-leave="afterLeaveContent">
        <div
          v-show="showContent"
          class="dialog__content-wrapper"
          @click.self="showContent = false"
        >
          <slot />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped src="./styles.scoped.css" />
<style scoped src="./animations.scoped.css" />
