import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./pages/PageIndex.vue'),
  },
  {
    name: 'welcome',
    path: '/welcome',
    component: () => import('./pages/PageWelcome.vue'),
  },
  {
    name: 'guest',
    path: '/guest/:guest',
    component: () => import('./pages/PageGuest.vue'),
  },
  {
    path: '/:name',
    children: [
      {
        name: 'check-in',
        path: '',
        component: () => import('./pages/PageCheckIn.vue'),
      },
      {
        name: 'check-in/stats',
        path: 'stats',
        component: () => import('./pages/PageStats.vue'),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
