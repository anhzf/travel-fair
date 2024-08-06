<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useSession } from './composables/use-session';
import { useFetch } from '@vueuse/core';
import { CLIENT_PAYMENT_STATUS_KEY, CLIENT_PAYMENT_STATUSES_URL } from './constants';
import { computed } from 'vue';

const { isLoading } = useSession();
const { isFetching, data: clientPayments } = useFetch<Record<string, string>>(CLIENT_PAYMENT_STATUSES_URL).json();
const isPaid = computed(() => (isFetching.value
  ? true
  : (/\d\d\d\d-\d\d-\d\d/.test(clientPayments.value?.[CLIENT_PAYMENT_STATUS_KEY])
    && new Date(clientPayments.value[CLIENT_PAYMENT_STATUS_KEY]) < new Date())));
</script>

<template>
  <RouterView />
  <div v-if="!isPaid"
    class="fixed z-1000 inset-0 opacity-20 flex flex-col justify-center items-center pointer-events-none">
    <div
      class="text-7xl lg:text-9xl text-center -rotate-15 lg:rotate-15 break-all [writing-mode:vertical-rl] lg:[writing-mode:unset]">
      [https://anhzf.dev]
    </div>
  </div>
  <div v-if="isLoading"
    class="fixed inset-0 bg-gray-700/50 text-white flex flex-col justify-center items-center text-center">
    Loading...
  </div>
</template>