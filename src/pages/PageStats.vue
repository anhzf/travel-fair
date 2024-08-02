<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getSummary } from '../lib/api';

const route = useRoute();

const name = computed(() => route.params.name as string);
const { state: general, isLoading, error } = useAsyncState(() => getSummary('visits'), null);

const data = [
  { id: '1', name: 'Moh. Abdal Jalil Sisha' },
  { id: '2', name: 'Muh. Sumbul' }
];
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <div class="text-center">
      <h1 class="mb-0">
        {{ name }}
      </h1>
      <div>
        Total Kunjungan: {{ isLoading ? 'Loading...' : general?.details[name]?.count ?? '-' }}
      </div>
      <div>
        Kunjungan Unik: {{ isLoading ? 'Loading...' : general?.details[name]?.unique ?? '-' }}
      </div>
    </div>

    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul class="w-full max-w-prose">
      <li v-for="el in data">
        <RouterLink :to="{ name: 'guest', params: { guest: el.id } }">
          {{ el.name }}
        </RouterLink>
      </li>
    </ul>
  </main>
</template>