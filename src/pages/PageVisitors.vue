<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core';
import { useLoading } from '../composables/use-loading';
import { exportGuestsAsCsv, getGuests } from '../lib/api';
import { omit } from '../utils/object';
import { download } from '../utils/ui';
import { computed, ref } from 'vue';
import { Select } from 'radix-vue/namespaced';

const SORT_OPTIONS = [
  'name',
  'age',
  'domicile',
  'visits',
  'createdAt',
];

const [isOverlayLoading, loading] = useLoading();

const query = ref({
  asc: false,
  sortBy: 'name',
});

const { state: data, isLoading, error, execute: refresh } = useAsyncState(() => getGuests(), []);

const sorted = computed(() => [...data.value].sort((a, b) => {
  const sortBy = query.value.sortBy;
  const asc = query.value.asc ? 1 : -1;

  switch (sortBy) {
    case 'name':
      return asc * a.name.localeCompare(b.name);

    case 'age':
      return asc * (a.questions.age - b.questions.age);

    case 'domicile':
      return asc * a.questions.domicile.localeCompare(b.questions.domicile);

    case 'visits':
      return asc * (a.visits.list.length - b.visits.list.length);

    case 'createdAt':
      return asc * a.createdAt.toMillis() - b.createdAt.toMillis();

    default:
      return 0;
  }
}));

const onExportClick = async () => {
  if (!window.confirm('Apakah Anda yakin ingin mengekspor data pengunjung?')) return;

  const blob = await loading(exportGuestsAsCsv(data.value));

  download('pengunjung.csv', blob);
};
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <div class="flex flex-col">
      <img src="/logo.png" alt="Logo" width="160" height="100" class="self-center object-contain">

      <h1 class="text-$theme mt-0 mb-0.3em">Daftar Pengunjung</h1>

      <div class="flex justify-center gap-2">
        <button type="button" :disabled="isLoading" @click="refresh()">
          ↻ Refresh
        </button>

        <div class="btn bg-transparent p-0 border-none">
          <button :disabled="isLoading || !sorted.length" class="rounded-r-none px-0.8em"
            @click="query.asc = !query.asc">
            {{ query.asc ? '↑' : '↓' }}
          </button>

          <Select.Root v-model="query.sortBy">
            <Select.Trigger :disabled="isLoading || !sorted.length" class="rounded-l-none pl-0.3em">
              <Select.Value placeholder="Urut berdasarkan..." />
            </Select.Trigger>

            <Select.Portal>
              <Select.Content class="min-w-16ch bg-$background rounded">
                <Select.Viewport>
                  <Select.Item v-for="el in SORT_OPTIONS" :key="el" :value="el"
                    class="flex px-2 py-1 relative select-none rounded-sm data-[highlighted]:outline-none data-[highlighted]:bg-green data-[highlighted]:text-green-50">
                    <Select.ItemText>
                      {{ el }}
                    </Select.ItemText>

                    <Select.ItemIndicator class="ml-1 text-green">
                      ✓
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <button type="button" :disabled="isLoading || !sorted.length" @click="onExportClick()">
          Export CSV
        </button>
      </div>
    </div>

    <div v-if="isLoading">
      Loading...
    </div>

    <table v-else-if="data.length" class="w-full max-w-screen-lg border-collapse">
      <thead>
        <tr class="border-b border-solid border-gray/25">
          <th class="text-white/50 px-2 py-2.5">
            #
          </th>
          <th class="text-left px-2 py-2.5">
            Nama
          </th>
          <th class="text-center px-2 py-2.5">
            No. Kontak
          </th>
          <th class="text-center px-2 py-2.5">
            Domisili
          </th>
          <th class="text-center px-2 py-2.5">
            Umur
          </th>
          <th class="text-center px-2 py-2.5">
            ...
          </th>
          <th class="text-right px-2 py-2.5">
            Stan dikunjungi
          </th>
          <th class="text-right px-2 py-2.5">
            Waktu Daftar
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(el, i) in sorted" :key="el.id" class="odd:bg-white/1 @dark:odd:bg-black/1">
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

          <td class="text-gray-400 text-right px-1 py-1.5">
            <div>{{ el.createdAt.toDate().toLocaleTimeString('id') }}</div>
            <div>{{ el.createdAt.toDate().toLocaleDateString('id') }}</div>
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

    <div v-if="isOverlayLoading" class="fixed inset-0 bg-gray-700/50 flex flex-col justify-center items-center">
      Loading...
    </div>
  </main>
</template>