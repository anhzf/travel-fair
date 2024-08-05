<script lang="ts" setup>
import { isValiError } from 'valibot';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLoading } from '../composables/use-loading';
import { useSession } from '../composables/use-session';
import { createGuest } from '../lib/api';
import { GuestCreateSchema } from '../models/guest';
import { getValiErrorMessages } from '../utils/error';
import { formToObject } from '../utils/form';

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
const DOMICILE_OPTIONS = [
  'Soloraya',
  'DIY',
  'Jateng',
  'Lainnya',
];

const route = useRoute();
const router = useRouter();

const [isLoading] = useLoading();
const { update: updateSession } = useSession();

const errors = ref<string[]>([]);

const onSubmit = async (ev: Event) => {
  try {
    const target = ev.target as HTMLFormElement;
    const payload = formToObject(target);

    Object.keys(payload).forEach((key) => {
      if (payload[key] instanceof File
        && payload[key].size === 0) {
        delete payload[key];
      }
    })

    const id = await createGuest(payload);

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
        <label for="welcome/name">Nama Lengkap</label>
        <input type="text" name="name" id="welcome/name" required class="px-3 py-2">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/phone">No. Handphone</label>
        <input type="tel" name="phone" id="welcome/phone" required class="px-3 py-2">
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
        <label for="welcome/domicile">Domisili</label>
        <select name="domicile" id="welcome/domicile" required class="px-3 py-2">
          <option value="" selected disabled>Pilih salah satu</option>
          <option v-for="value in DOMICILE_OPTIONS" :key="value" :value>
            {{ value }}
          </option>
        </select>
      </fieldset>

      <fieldset class="grid border-none">
        <legend>Apa yang membuat Anda tertarik dalam membeli paket Umrah?</legend>
        <div v-for="value in INTEREST_OPTIONS" :key="value">
          <input type="checkbox" name="interests" :value :id="`welcome/interests/${value}`" />
          <label :for="`welcome/interests/${value}`">
            {{ value }}
          </label>
        </div>
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofFollow">Bukti Follow</label>
        <input type="file" name="proofFollow" id="welcome/proofFollow"
          :accept="GuestCreateSchema.entries.proofFollow.wrapped.pipe[1].requirement.join(',')" class="px-3 py-2">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofStory">Bukti Share Story</label>
        <input type="file" name="proofStory" id="welcome/proofStory"
          :accept="GuestCreateSchema.entries.proofStory.wrapped.pipe[1].requirement.join(',')" class="px-3 py-2">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofComment">Bukti Komen</label>
        <input type="file" name="proofComment" id="welcome/proofComment"
          :accept="GuestCreateSchema.entries.proofComment.wrapped.pipe[1].requirement.join(',')" class="px-3 py-2">
      </fieldset>

      <div v-if="errors.length">
        <ul class="text-red-500">
          <li v-for="err in errors" :key="err">
            {{ err }}
          </li>
        </ul>
      </div>

      <button type="submit" :disabled="isLoading">
        Daftar
      </button>
    </form>
  </main>
</template>