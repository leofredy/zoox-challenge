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
        breadcrumb.value = route.meta.breadcrumb.map((breadcrumbItem, breadcrumbItemIndex) => {
          return {
            label: breadcrumbItem,
            current: (route.meta.breadcrumb.length - 1 === breadcrumbItemIndex),
            path: breadcrumbItemIndex === 0 ? '/' : route.path
          }
        })
      }
    }
  );

  return {
    breadcrumb
  };
}