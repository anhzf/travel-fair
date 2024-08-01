import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useGuest } from './composables/use-guest';
import { until } from '@vueuse/core';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./pages/PageIndex.vue'),
  },
  {
    path: '/welcome',
    children: [
      {
        name: 'welcome',
        path: '',
        component: () => import('./pages/PageWelcome.vue'),
        meta: { guest: false },
      },
      {
        name: 'welcome/thank-you',
        path: 'thank-you',
        component: () => import('./pages/PageThankYou.vue'),
      },
    ],
  },
  {
    name: 'guest',
    path: '/guest/:guest?',
    component: () => import('./pages/PageGuest.vue'),
  },
  {
    path: '/:name',
    children: [
      {
        name: 'check-in',
        path: '',
        component: () => import('./pages/PageCheckIn.vue'),
        meta: { guest: true },
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

router.beforeEach(async (to, _, next) => {
  const { data: guest, isLoading } = useGuest();
  await until(isLoading).toBe(false);

  if (to.meta.guest === true) {
    if (guest.value) return next();
    else return next({ name: 'welcome' });
  } else if (to.meta.guest === false) {
    if (guest.value) return next({ name: 'guest' });
    else return next();
  }

  return next();
});