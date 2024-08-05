<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core';
import { getGuests } from '../lib/api';
import { omit } from '../utils/object';

const { state: data, isLoading, error } = useAsyncState(() => getGuests(), []);
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <h1>Daftar Pengunjung</h1>

    <div v-if="isLoading">
      Loading...
    </div>

    <table v-if="data.length" class="w-full max-w-screen-lg border-collapse">
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
          <th class="text-center border-b border-solid border-white/50 px-2 py-2.5">
            ...
          </th>
          <th class="text-right border-b border-solid border-white/50 px-2 py-2.5">
            Jml. Stan dikunjungi
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(el, i) in data" :key="el.id" class="odd:bg-white/1 @dark:odd:bg-black/1">
          <td class="w-4ch text-gray-400 text-center px-1 py-1.5">
            {{ i + 1 }}
          </td>

          <td class="min-w-16ch px-1 py-1.5">
            <RouterLink :to="{ name: 'guest', params: { guest: el.id } }">
              {{ el.name }}
            </RouterLink>
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

          <td class="text-left">
            <ul class="m-1">
              <li v-for="(answer, question) in omit(el.questions, 'domicile', 'age')">
                {{ question }}
                <span v-if="!answer || answer === '-'">❌</span>
                <span v-else>✅</span>
              </li>
            </ul>
          </td>

          <td class="text-gray-400 text-right px-1 py-1.5">
            x{{ el.visits.list.length }}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else>
      No data
    </div>
  </main>
</template>