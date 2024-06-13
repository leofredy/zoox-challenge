import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import type { Breadcrumb } from '@/types/breadcrumb';

export function useBreadcrumb() {
  const breadcrumb = ref<Breadcrumb>([]);
  const route = useRoute();


  watch(
    () => route.matched,
    () => {
      if (route.matched) {
        breadcrumb.value = route.matched.map((matchedItem, matchedItemIndex) => {
          return {
            label: matchedItem.meta.breadcrumb,
            current: matchedItemIndex === (route.matched.length - 1),
            path: matchedItem.path
          }
        })
      }
    }
  );

  return {
    breadcrumb
  };
}