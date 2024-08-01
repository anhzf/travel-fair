<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';
import { PARTICIPANTS } from '../contents';

const qr = ref<{
  title: string;
}>();
</script>

<template>
  <main class="container mx-auto flex flex-col items-center">
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
            QR
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="el in PARTICIPANTS" :key="el" class="odd:bg-black/1 @dark:odd:bg-white/1">
          <td class="py-1 ">
            <RouterLink :to="{ name: 'check-in/stats', params: { name: el } }"
              class="underline decoration-dashed hover:decoration-solid decoration-1.5px">
              {{ el }}
            </RouterLink>
          </td>
          <td class="py-1 w-20ch text-center">
            {{ NaN }}
          </td>
          <td class="py-1 w-20ch text-center">
            <button type="button" @click="qr = { title: el }">
              Lihat
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>

  <Dialog :open="!!qr" class="relative z-100 flex flex-col justify-center items-center">
    <div class="fixed inset-0 bg-gray-700/50" aria-hidden="true" />

    <div class="fixed inset-0 p-8 flex flex-col justify-center items-center">
      <DialogPanel
        class="grow w-full max-w-prose h-full max-h-full bg-$background rounded flex flex-col overflow-hidden">
        <DialogTitle class="text-center mb-0">
          Lihat QR
        </DialogTitle>
        <DialogDescription class="text-center text-opacity-20">
          {{ qr!.title }}
        </DialogDescription>

        <div class="flex flex-col py-2 overflow-y-auto">
          <img src="https://placehold.co/500" width="500" height="500" :alt="`QR ${qr!.title}`" class="size-full">
        </div>

        <div class="flex flex-col items-stretch p-3">
          <button type="button" @click="qr = undefined">Close</button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>