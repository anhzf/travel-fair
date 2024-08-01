<script setup lang="ts">
import { Dialog, DialogDescription, DialogPanel, DialogTitle } from '@headlessui/vue';
import { useAsyncState } from '@vueuse/core';
import { toDataURL } from 'qrcode';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AsyncState from '../components/AsyncState.vue';
import { PARTICIPANTS } from '../contents';
import { getSummary } from '../lib/api';

const router = useRouter();

const { state, isLoading, execute: refresh, error } = useAsyncState(() => getSummary('visits'), null);

const qr = ref<{
  title: string;
}>();

const qrString = computed(() => {
  if (!qr.value) return '';
  const { fullPath } = router.resolve({ name: 'check-in', params: { name: qr.value?.title } });
  const url = new URL(location.origin);
  url.pathname = fullPath;
  return url.toString();
});
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <div v-if="error" class="text-red-500 w-full">{{ error }}</div>

    <div class="w-full flex justify-between items-start gap-4">
      <div>
        <h1 class="text-xl m-0">
          Ringkasan Kunjungan
        </h1>

        <div>
          <b class="font-medium">Total: </b> {{ isLoading ? 'Loading...' : state?.total || '-' }}
        </div>
        <div>
          <b class="font-medium">Total unik: </b> {{ isLoading ? 'Loading...' : state?.unique || '-' }}
        </div>
      </div>

      <button type="button" :disabled="isLoading" @click="refresh()">
        ↻ Refresh
      </button>
    </div>


    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b border-b-solid border-white/25">
          <th class="px-1 py-2.5">
            Nama
          </th>
          <th class="px-1 py-2.5">
            Jumlah Kunjungan
          </th>
          <th class="px-1 py-2.5">
            ...
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="el in PARTICIPANTS" :key="el" class="odd:bg-black/1 @dark:odd:bg-white/1">
          <td class="py-1 min-w-12ch">
            <RouterLink :to="{ name: 'check-in/stats', params: { name: el } }"
              class="underline decoration-dashed hover:decoration-solid decoration-1.5px">
              {{ el }}
            </RouterLink>
          </td>
          <td class="py-1 w-20ch text-center">
            {{ isLoading ? 'Loading...' : state?.details[el]?.count || '-' }}
          </td>
          <td class="py-1 w-20ch text-center">
            <button type="button" @click="qr = { title: el }">
              Lihat QR
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>

  <Dialog :open="!!qr" class="relative z-100 flex flex-col justify-center items-center">
    <div class="fixed inset-0 bg-gray-700/50" aria-hidden="true" @click="qr = undefined" />

    <div class="fixed inset-0 p-4 lg:p-8 flex flex-col justify-center items-center" @click.self="qr = undefined">
      <DialogPanel class="w-full max-w-prose max-h-full bg-$background rounded flex flex-col overflow-hidden">
        <DialogTitle class="text-center mb-0">
          Lihat QR
        </DialogTitle>
        <DialogDescription class="text-center text-opacity-20">
          {{ qr!.title }}
        </DialogDescription>

        <div class="flex flex-col py-2 overflow-y-auto">
          <AsyncState :value="toDataURL(qrString, { width: 500 })" #="{ state: src }">
            <img :src width="500" height="500" :alt="`QR ${qr!.title}`"
              class="size-full object-contain relative before:content-[''] before:absolute before:inset-0 before:bg-gray before:animate-pulse">
          </AsyncState>
        </div>

        <div class="flex flex-col items-stretch p-3">
          <button type="button" @click="qr = undefined">Close</button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>