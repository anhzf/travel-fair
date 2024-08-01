<script lang="ts" setup>
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

const onSubmit = (ev: Event) => {
  const target = ev.target as HTMLFormElement;
  const fd = new FormData(target);

  console.log(Object.fromEntries(fd));
}
</script>

<template>
  <main class="container flex flex-col items-center gap-6">
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
        <input type="file" name="proofFollow" id="welcome/proofFollow" accept="image/*" required class="px-3 py-2">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofStory">Bukti Share Story</label>
        <input type="file" name="proofStory" id="welcome/proofStory" accept="image/*" required class="px-3 py-2">
      </fieldset>

      <fieldset class="grid border-none">
        <label for="welcome/proofComment">Bukti Komen</label>
        <input type="file" name="proofComment" id="welcome/proofComment" accept="image/*" required class="px-3 py-2">
      </fieldset>

      <button type="submit">
        Simpan
      </button>
    </form>
  </main>
</template>