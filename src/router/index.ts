import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { breadcrumb: ['Início'] }
    },
    {
      path: '/detail/:slug',
      name: 'detail',
      component: () => import(/*  */ '../views/DetailView/DetailView.vue'),
      meta: { breadcrumb: ['Início', 'Detalhe do CSV'] }
    }
  ]
})

export default router
