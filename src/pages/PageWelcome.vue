<script lang="ts" setup>
import { isValiError } from 'valibot';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGuest } from '../composables/use-guest';
import { useLoading } from '../composables/use-loading';
import { createGuest } from '../lib/api';
import { GuestCreateSchema } from '../models/guest';
import { getValiErrorMessages } from '../utils/error';

const INTEREST_OPTIONS = [
  'Harga',
  'Fasilitas yang lebih baik',
  'Destinasi',
  'Hotel',
  'Pesawat',
  'Ustadz dan Pembimbing',
];
const AGE_OPTIONS = [
  '17-25',
  '26-35',
  '35-50',
  '50+',
];

const route = useRoute();
const router = useRouter();

const [isLoading, loading] = useLoading();
const { updateSession } = useGuest();

const errors = ref<string[]>([]);

const onSubmit = async (ev: Event) => {
  try {
    const target = ev.target as HTMLFormElement;
    const fd = new FormData(target);

    const id = await createGuest(Object.fromEntries(fd) as any);

    await updateSession(id);

    router.push(route.redirectedFrom ?? { name: 'welcome/thank-you' });
  } catch (err) {
    errors.value = isValiError(err)
      ? getValiErrorMessages(err)
      : [String(err)];
  }
}
</script>

<template>
  <main class="container m-auto flex flex-col items-center gap-6">
    <h1 class="text-4xl">
      Selamat Datang!
    </h1>

    <form class="flex flex-col gap-4 w-full max-w-prose" @submit.prevent="onSubmit">
      <fieldset class="grid border-none">
        <label for="welcome/name">Nama</label>
        <input type="text" name="name" id="welcome/name" required class="px-3 py-2">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/phone">No. Handphone</label>
        <input type="tel" name="phone" id="welcome/phone" required class="px-3 py-2">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/interest">Apa yang membuat Anda tertarik dalam membeli paket Umrah?</label>
        <select name="interest" id="welcome/interest" required class="px-3 py-2">
          <option value="" selected disabled>Pilih salah satu</option>
          <option v-for="value in INTEREST_OPTIONS" :key="value" :value>
            {{ value }}
          </option>
        </select>
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/age">Umur</label>
        <select name="age" id="welcome/age" required class="px-3 py-2">
          <option value="" selected disabled>Pilih salah satu</option>
          <option v-for="value in AGE_OPTIONS" :key="value" :value>
            {{ value }}
          </option>
        </select>
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofFollow">Bukti Follow</label>
        <input type="file" name="proofFollow" id="welcome/proofFollow"
          :accept="GuestCreateSchema.entries.proofFollow.pipe[1].requirement.join(',')" required class="px-3 py-2">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofStory">Bukti Share Story</label>
        <input type="file" name="proofStory" id="welcome/proofStory"
          :accept="GuestCreateSchema.entries.proofStory.pipe[1].requirement.join(',')" required class="px-3 py-2">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofComment">Bukti Komen</label>
        <input type="file" name="proofComment" id="welcome/proofComment"
          :accept="GuestCreateSchema.entries.proofComment.pipe[1].requirement.join(',')" required class="px-3 py-2">
      </fieldset>

      <div v-if="errors.length">
        <ul class="text-red-500">
          <li v-for="err in errors" :key="err">
            {{ err }}
          </li>
        </ul>
      </div>

      <button type="submit" :disabled="isLoading">
        Simpan
      </button>
    </form>
  </main>
</template>