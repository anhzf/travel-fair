<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useGuest } from './composables/use-guest';

const { isLoading } = useGuest();
</script>

<template>
  <RouterView />
  <div v-if="isLoading" class="fixed inset-0 bg-gray-700/50 flex flex-col justify-center items-center text-center">
    Loading...
  </div>
</template>