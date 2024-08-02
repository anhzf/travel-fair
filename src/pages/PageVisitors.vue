<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core';
import { getGuests } from '../lib/api';

const { state: data, isLoading, error } = useAsyncState(() => getGuests(), []);
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <h1>Daftar Pengunjung</h1>

    <div v-if="isLoading">
      Loading...
    </div>

    <ul v-else-if="data.length" class="w-full max-w-prose">
      <li v-for="el in data">
        <RouterLink :to="{ name: 'guest', params: { guest: el.id } }">
          {{ el.name }}
        </RouterLink>
      </li>
    </ul>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else>
      No data
    </div>
  </main>
</template>