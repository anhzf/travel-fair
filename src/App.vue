<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useSession } from './composables/use-session';

const { isLoading } = useSession();
</script>

<template>
  <RouterView />
  <div v-if="isLoading" class="fixed inset-0 bg-gray-700/50 flex flex-col justify-center items-center text-center">
    Loading...
  </div>
</template>