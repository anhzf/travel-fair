<script lang="ts" setup>
import { isValiError } from 'valibot';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLoading } from '../composables/use-loading';
import { useSession } from '../composables/use-session';
import { SPONSORS } from '../contents';
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
    <div class="flex flex-col items-center">
      <img src="/logo.png" alt="Logo" width="300" height="200" class="object-contain">

      <h1 class="text-xl text-$theme text-center m-0 font-semibold whitespace-pre-line">
        {{ 'Selamat Datang Peserta\nPameran Umrah Travel Fair 2024' }}
      </h1>
    </div>

    <form class="mt-8 flex flex-col gap-4 w-full max-w-prose" @submit.prevent="onSubmit">
      <fieldset class="grid border-none">
        <label for="welcome/name" class="font-semibold">Nama Lengkap</label>
        <input type="text" name="name" id="welcome/name" required
          class="px-2.5 py-3 bg-gray-50 border border-gray-200 border-solid">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/phone" class="font-semibold">No. Handphone</label>
        <input type="tel" name="phone" id="welcome/phone" required
          class="px-2.5 py-3 bg-gray-50 border border-gray-200 border-solid">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/age" class="font-semibold">Umur</label>
        <select name="age" id="welcome/age" required class="px-2.5 py-3 bg-gray-50 border border-gray-200 border-solid">
          <option value="" selected disabled>Pilih salah satu</option>
          <option v-for="value in AGE_OPTIONS" :key="value" :value>
            {{ value }}
          </option>
        </select>
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/domicile" class="font-semibold">Domisili</label>
        <select name="domicile" id="welcome/domicile" required
          class="px-2.5 py-3 bg-gray-50 border border-gray-200 border-solid">
          <option value="" selected disabled>Pilih salah satu</option>
          <option v-for="value in DOMICILE_OPTIONS" :key="value" :value>
            {{ value }}
          </option>
        </select>
      </fieldset>

      <fieldset class="grid border-none">
        <legend class="font-semibold">Apa yang membuat Anda tertarik dalam membeli paket Umrah?</legend>
        <label v-for="value in INTEREST_OPTIONS" :key="value" class="flex gap-2 p-0.5">
          <input type="checkbox" name="interests" :value :id="`welcome/interests/${value}`" />
          <span class="text-gray-700">
            {{ value }}
          </span>
        </label>
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofFollow" class="font-semibold">Bukti Follow</label>
        <input type="file" name="proofFollow" id="welcome/proofFollow"
          :accept="GuestCreateSchema.entries.proofFollow.wrapped.pipe[1].requirement.join(',')"
          class="px-2.5 py-3 bg-gray-50 border border-gray-200 border-solid">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofStory" class="font-semibold">Bukti Share Story</label>
        <input type="file" name="proofStory" id="welcome/proofStory"
          :accept="GuestCreateSchema.entries.proofStory.wrapped.pipe[1].requirement.join(',')"
          class="px-2.5 py-3 bg-gray-50 border border-gray-200 border-solid">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofComment" class="font-semibold">Bukti Komen</label>
        <input type="file" name="proofComment" id="welcome/proofComment"
          :accept="GuestCreateSchema.entries.proofComment.wrapped.pipe[1].requirement.join(',')"
          class="px-2.5 py-3 bg-gray-50 border border-gray-200 border-solid">
      </fieldset>

      <fieldset class="border-none">
        <label>
          <input type="checkbox" name="acceptTerms" id="welcome/acceptTerms" required>
          <span class="">
            Dengan ini saya menyatakan setuju dengan syarat dan ketentuan yang ditetapkan dalam acara Travel Fair 2024
            ini.
          </span>
        </label>
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