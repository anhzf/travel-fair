<script lang="ts" setup>
import { useGuest } from '../composables/use-guest';

const { data } = useGuest();
</script>

<template>
  <main class="container m-auto flex flex-col items-center gap-6">
    <div class="text-center">
      <h1>🥳 Terima Kasih!</h1>
      <p>
        Selamat menikmati acara ini, {{ data?.name }}!
      </p>
    </div>
  </main>
</template>