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
const terms = {
  'Kelayakan Peserta': [
    'Peserta yang berhak mengikuti undian giveaway adalah pengunjung Travel Fair yang telah mengunjungi minimal 7 (tujuh) stand selama periode pameran Travel Fair berlangsung.',
    'Peserta harus mengisi semua formulir pendaftaran Travel Fair dengan lengkap dan benar.'
  ],
  'Kebijakan Hadiah': [
    'Hadiah voucher umroh gratis yang diberikan melalui program giveaway tidak dapat dipindahtangankan atau dijual kembali kepada pihak lain.',
    'Voucher umroh gratis tidak dapat atas nama orang lain. Penerima hadiah akan dikonfirmasi berdasarkan identitas yang terdaftar saat pendaftaran.'
  ],
  'Ketentuan Umum': [
    'Panitia berhak untuk mengubah syarat dan ketentuan giveaway sewaktu-waktu tanpa pemberitahuan terlebih dahulu.',
    'Keputusan panitia bersifat final dan tidak dapat diganggu gugat.'
  ],
  'Proses Pengundian': [
    'Pengundian akan dilakukan secara acak dan dilakukan oleh panitia di akhir acara Travel Fair.',
    'Hasil undian akan diumumkan melalui media yang ditentukan oleh panitia.'
  ],
};

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
        <label for="welcome/proofFollow" class="font-semibold">Bukti Follow Instagram**</label>
        <input type="file" name="proofFollow" id="welcome/proofFollow"
          :accept="GuestCreateSchema.entries.proofFollow.wrapped.pipe[1].requirement.join(',')"
          class="px-2.5 py-3 bg-gray-50 border border-gray-200 border-solid">
        <small class="text-gray-600">
          *Max {{ GuestCreateSchema.entries.proofFollow.wrapped.pipe[2].requirement / 1024 }} KB
        </small>
        <small class="text-gray-600">
          **Akun instagram: <a href="https://www.instagram.com/umrohtravelfairsolo/" target="_blank"
            rel="noopener noreferrer">@umrohtravelfairsolo</a>
        </small>
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofStory" class="font-semibold">Bukti Share Story</label>
        <input type="file" name="proofStory" id="welcome/proofStory"
          :accept="GuestCreateSchema.entries.proofStory.wrapped.pipe[1].requirement.join(',')"
          class="px-2.5 py-3 bg-gray-50 border border-gray-200 border-solid">
        <small class="text-gray-600">
          *Max {{ GuestCreateSchema.entries.proofStory.wrapped.pipe[2].requirement / 1024 }} KB
        </small>
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofComment" class="font-semibold">Bukti Komen</label>
        <input type="file" name="proofComment" id="welcome/proofComment"
          :accept="GuestCreateSchema.entries.proofComment.wrapped.pipe[1].requirement.join(',')"
          class="px-2.5 py-3 bg-gray-50 border border-gray-200 border-solid">
        <small class="text-gray-600">
          *Max {{ GuestCreateSchema.entries.proofComment.wrapped.pipe[2].requirement / 1024 }} KB
        </small>
      </fieldset>

      <fieldset class="border-none">
        <div class="bg-gray-100 px-2 py-1 mb-1 border border-solid border-gray-200">
          <div class="font-bold">Syarat dan Ketentuant Giveaway Voucher Umroh Gratis Travel Fair 2024</div>
          <ol class="pl-4">
            <li v-for="(children, term) in terms" :key="term">
              <div class="font-semibold">{{ term }}</div>
              <ul class="pl-4">
                <li v-for="child in children" :key="child">
                  {{ child }}
                </li>
              </ul>
            </li>
          </ol>
        </div>

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

    <div v-if="isLoading"
      class="fixed inset-0 bg-gray-700/50 text-white flex flex-col justify-center items-center text-center">
      Loading...
    </div>
  </main>
</template>