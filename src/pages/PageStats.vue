<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core';
import { Select } from 'radix-vue/namespaced';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useLoading } from '../composables/use-loading';
import { exportGuestsAsCsv, getGuestsByBooth, getSummary } from '../lib/api';
import { download } from '../utils/ui';

const SORT_OPTIONS = [
  'name',
  'createdAt',
];

const route = useRoute();

const [isOverlayLoading, loading] = useLoading();

const name = computed(() => route.params.name as string);

const query = ref({
  asc: false,
  sortBy: 'name',
});

const { state: general, isLoading, error } = useAsyncState(() => getSummary('visits'), null);
const { state: guests, isLoading: guestsIsLoading, error: guestsError, execute: refresh } = useAsyncState(
  () => getGuestsByBooth(name.value), [],
);

const visits = computed(() => {
  if (!guests.value) return [];

  return guests.value.flatMap(({ visits, ...guest }) => {
    const byName = visits.details[name.value];
    return byName.timestamps.map((timestamp) => ({
      ...guest,
      timestamp,
    }));
  })
    .sort((a, b) => {
      const sortBy = query.value.sortBy;
      const asc = query.value.asc ? 1 : -1;

      if (sortBy === 'name') {
        return asc * a.name.localeCompare(b.name);
      }

      if (sortBy === 'createdAt') {
        return asc * (a.timestamp.toMillis() - b.timestamp.toMillis());
      }

      return 0;
    });
});

const onExportClick = async () => {
  if (!window.confirm('Apakah Anda yakin ingin mengekspor data pengunjung?')) return;

  const blob = await loading(exportGuestsAsCsv(guests.value));

  download('pengunjung.csv', blob);
};
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <div class="flex flex-col gap-2">
      <img src="/logo.png" alt="Logo" width="160" height="100" class="self-center object-contain">

      <h1 class="text-$theme text-center my-0">
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

      <div class="flex justify-center gap-2">
        <button type="button" :disabled="guestsIsLoading" @click="refresh()">
          ↻ Refresh
        </button>

        <div class="btn bg-transparent p-0 border-none">
          <button :disabled="guestsIsLoading || !guests.length" class="rounded-r-none px-0.8em"
            @click="query.asc = !query.asc">
            {{ query.asc ? '↑' : '↓' }}
          </button>

          <Select.Root v-model="query.sortBy">
            <Select.Trigger :disabled="guestsIsLoading || !guests.length" class="rounded-l-none pl-0.3em">
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

        <button type="button" :disabled="guestsIsLoading || !guests.length" @click="onExportClick()">
          Export CSV
        </button>
      </div>
    </div>

    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="guestsError" class="text-red-500">{{ guestsError }}</div>

    <div v-if="guestsIsLoading">
      Loading...
    </div>

    <table v-else-if="guests.length" class="w-full max-w-screen-lg border-collapse">
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

    <div v-else>
      No data
    </div>

    <div v-if="isOverlayLoading" class="fixed inset-0 bg-gray-700/50 flex flex-col justify-center items-center">
      Loading...
    </div>
  </main>
</template>