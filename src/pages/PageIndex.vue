<script setup lang="ts">
import { Dialog, DialogDescription, DialogPanel, DialogTitle } from '@headlessui/vue';
import { useAsyncState } from '@vueuse/core';
import { toDataURL } from 'qrcode';
import { computed, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import AsyncState from '../components/AsyncState.vue';
import { BOOTHS } from '../contents';
import { getSummary, setPassword } from '../lib/api';
import { useLoading } from '../composables/use-loading';

const router = useRouter();

const [isLoadingOverlay, loading] = useLoading();
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

const onSetPasswordClick = async () => {
  const oldPwd = window.prompt('Masukkan password lama') || '';
  const newPwd = window.prompt('Masukkan password baru') || '';

  try {
    await loading(setPassword(oldPwd, newPwd));

    await router.replace({ query: { pwd: newPwd } });
    window.alert('Password berhasil diubah, Anda dapat menyalin url yang baru sekarang.');
  } catch (err) {
    window.alert(String(err));
  }
};
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <div v-if="error" class="text-red-500 w-full">{{ error }}</div>

    <div class="w-full flex justify-between items-start gap-4">
      <div>
        <h1 class="text-2xl text-$theme m-0">
          Ringkasan Kunjungan
        </h1>

        <div>
          <b class="font-medium">Total: </b> {{ isLoading ? 'Loading...' : state?.total || '-' }}
        </div>
        <div>
          <b class="font-medium">Total unik: </b> {{ isLoading ? 'Loading...' : state?.unique || '-' }}
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-2 items-end lg:items-center">
        <RouterLink :to="{ name: 'visitors' }" class="px-0.6em py-1.2em">
          Semua pengunjung
        </RouterLink>
        <button type="button" :disabled="isLoading" @click="refresh()">
          ↻ Refresh
        </button>
        <button type="button" :disabled="isLoading || isLoadingOverlay" @click="onSetPasswordClick">
          Atur password
        </button>
      </div>
    </div>


    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b border-b-solid border-gray/25">
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
        <tr v-for="name in Object.keys(BOOTHS)" :key="name" class="odd:bg-black/1">
          <td class="py-1 min-w-12ch">
            <RouterLink :to="{ name: 'check-in/stats', params: { name: name } }">
              {{ name }}
            </RouterLink>
          </td>
          <td class="py-1 w-20ch text-center">
            {{ isLoading ? 'Loading...' : state?.details[name]?.count || '-' }}
          </td>
          <td class="py-1 w-20ch text-center">
            <button type="button" @click="qr = { title: name }">
              Lihat QR
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>

  <Teleport v-if="isLoadingOverlay" to="body">
    <div class="fixed inset-0 bg-gray-700/50 flex flex-col justify-center items-center">
      Loading...
    </div>
  </Teleport>


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