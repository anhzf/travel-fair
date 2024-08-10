import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useSession } from './composables/use-session';
import { until } from '@vueuse/core';
import { checkPassword } from './lib/api';

export const routes: RouteRecordRaw[] = [
  {
    name: 'error',
    path: '/error',
    component: () => import('./pages/PageError.vue'),
  },
  {
    name: 'index',
    path: '/',
    component: () => import('./pages/PageIndex.vue'),
    meta: { pwd: true },
  },
  {
    name: 'visitors',
    path: '/visitors',
    component: () => import('./pages/PageVisitors.vue'),
    meta: { pwd: true },
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
        meta: { guest: true },
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

// Stores the password for the current session (memory only).
let passwordMemory: string;

router.beforeEach(async (to, _, next) => {
  const { data: guest, isLoading } = useSession();
  await until(isLoading).toBe(false);

  if (to.meta.pwd == true) {
    const isAllowed = await checkPassword(passwordMemory ?? to.query.pwd as string);

    if (isAllowed) {
      passwordMemory = to.query.pwd as string;
    }

    return isAllowed
      ? next()
      : next({ name: 'error', query: { msg: 'Anda tidak memiliki akses.' } });
  }

  if (to.meta.guest === true) {
    if (guest.value) return next();
    else return next({ name: 'welcome' });
  } else if (to.meta.guest === false) {
    if (guest.value) return next({ name: 'guest' });
    else return next();
  }

  return next();
});