<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getGuestsByBooth, getSummary } from '../lib/api';

const route = useRoute();

const name = computed(() => route.params.name as string);
const { state: general, isLoading, error } = useAsyncState(() => getSummary('visits'), null);
const { state: guests, isLoading: guestsIsLoading, error: guestsError } = useAsyncState(() => getGuestsByBooth(name.value), null);

const visits = computed(() => {
  if (!guests.value) return [];

  return guests.value.flatMap(({ visits, ...guest }) => {
    const byName = visits.details[name.value];
    return byName.timestamps.map((timestamp) => ({
      ...guest,
      timestamp,
    }));
  })
    .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
});
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <div class="text-center">
      <h1 class="mb-0">
        {{ name }}
      </h1>
      <div class="flex justify-center gap-2">
        <div>
          <span class="text-gray-400">Total Kunjungan:</span> <span class="font-semibold">
            {{ isLoading ? 'Loading...' : general?.details[name]?.count ?? '-' }}
          </span>
        </div>
        <div class="text-green-400">•</div>
        <div>
          <span class="text-gray-400">Kunjungan Unik:</span> <span class="font-semibold">
            {{ isLoading ? 'Loading...' : general?.details[name]?.unique ?? '-' }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="guestsError" class="text-red-500">{{ guestsError }}</div>

    <table v-if="guests" class="w-full max-w-screen-lg border-collapse">
      <thead>
        <tr>
          <th class="text-white/50 border-b border-solid border-white/50 px-2 py-2.5">
            #
          </th>
          <th class="text-left border-b border-solid border-white/50 px-2 py-2.5">
            Nama
          </th>
          <th class="text-center border-b border-solid border-white/50 px-2 py-2.5">
            No. Kontak
          </th>
          <th class="text-center border-b border-solid border-white/50 px-2 py-2.5">
            Domisili
          </th>
          <th class="text-center border-b border-solid border-white/50 px-2 py-2.5">
            Umur
          </th>
          <th class="text-right border-b border-solid border-white/50 px-2 py-2.5">
            Tanggal dan Waktu
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(el, i) in visits" :key="el.timestamp.toMillis()" class="odd:bg-white/1 @dark:odd:bg-black/1">
          <td class="w-4ch text-gray-400 text-center px-1 py-1.5">{{ i + 1 }}</td>
          <td class="min-w-16ch px-1 py-1.5">
            {{ el.name }}
          </td>
          <td class="text-center select-all">
            <a :href="`tel:+${el.phone}`">
              {{ el.phone }}
            </a>
          </td>
          <td class="text-center">
            {{ el.questions.domicile }}
          </td>
          <td class="text-center">
            {{ el.questions.age }}
          </td>
          <td class="text-gray-400 text-right px-1 py-1.5">
            {{ el.timestamp.toDate().toLocaleString('id') }}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="guestsIsLoading">
      Loading stats...
    </div>
  </main>
</template>