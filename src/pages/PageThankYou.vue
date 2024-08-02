<script lang="ts" setup>
import { useSession } from '../composables/use-session';

const { data } = useSession();
</script>

<template>
  <main class="container m-auto flex flex-col items-center gap-6">
    <div class="text-center">
      <h1>🥳 Terima Kasih!</h1>
      <p>
        Selamat menikmati acara ini, <span class="font-semibold">{{ data?.name }}</span>!
      </p>
    </div>
  </main>
</template>