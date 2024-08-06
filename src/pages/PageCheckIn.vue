<script lang="ts" setup>
import { isValiError } from 'valibot';
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useLoading } from '../composables/use-loading';
import { useSession } from '../composables/use-session';
import { BOOTHS, SPONSORS } from '../contents';
import { checkIn } from '../lib/api';
import { getValiErrorMessages } from '../utils/error';

const route = useRoute();

const name = computed(() => route.params.name as string);

const [isLoading, loading] = useLoading();
const errors = ref<string[]>([]);

const { data: guest } = useSession();

const isCheckedIn = ref(false);

const onSubmit = async () => {
  try {
    await loading(checkIn(guest.value?.id as string, route.params.name as string));
    isCheckedIn.value = true;
  } catch (err) {
    errors.value = isValiError(err)
      ? getValiErrorMessages(err)
      : [String(err)];
  }
};
</script>

<template>
  <main class="container mx-auto flex flex-col justify-between items-center gap-20">
    <img src="/logo.png" alt="Logo" width="300" height="200" class="object-contain">

    <section v-if="BOOTHS.includes(name)" class="w-full max-w-prose flex flex-col justify-center items-center">
      <div class="w-full max-w-prose">
        <div v-if="isCheckedIn" class="text-green">
          Terima kasih telah mengunjungi
        </div>
        <div v-else>
          Anda sedang mengunjungi
        </div>
        <h1 class="mt-0 text-$theme">
          {{ $route.params.name }}
        </h1>
      </div>

      <form class="w-full max-w-prose flex flex-col gap-4" @submit.prevent="onSubmit">
        <input type="hidden" name="check-in/id" :value="$route.params.name">
        <input type="hidden" name="check-in/name" :value="guest?.id">

        <div class="text-lg text-center">
          Sebagai <strong>{{ guest?.name }}</strong>
        </div>

        <template v-if="isCheckedIn">
          <div
            class="w-full text-xl px-2 py-3 bg-green-300/50 text-green-700 text-center rounded border border-solid border-green-400">
            Anda telah check-in ✓
          </div>

          <RouterLink :to="{ name: 'guest' }" class="flex justify-center text-center px-2 py-3">
            Lihat riwayat kunjungan
          </RouterLink>
        </template>

        <button v-else :disabled="isLoading"
          :class="['w-full text-xl py-3 @dark:shadow-white/10', isLoading ? 'shadow-none' : 'shadow-xl']">
          Check In
        </button>
      </form>
    </section>

    <div v-else>
      <h1>Tidak ditemukan</h1>
    </div>

    <ul v-if="errors.length">
      <li v-for="error in errors" :key="error" class="text-red-500">{{ error }}</li>
    </ul>

    <section class="flex flex-col">
      <h2 class="sr-only">Sponsorship by</h2>

      <ul class="p-0 flex gap-4 flex-wrap justify-center place-content-center list-none">
        <li v-for="(sponsor, key) in SPONSORS" :key>
          <img :src="sponsor.img" :alt="sponsor.title" :title="sponsor.title" width="100" height="100" loading="lazy"
            class="object-contain">
        </li>
      </ul>
    </section>
  </main>
</template>