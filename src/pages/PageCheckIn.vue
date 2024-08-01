<script lang="ts" setup>
import { parse } from 'valibot';
import { GuestSchema } from '../models/guest';

const user = {
  ...parse(GuestSchema, {
    name: 'Moh. Abdal Jalil Sisha',
    phone: '6285123456789'
  }),
  id: Date.now(),
};
</script>

<template>
  <main class="container mx-auto flex flex-col justify-center items-center gap-6">
    <div>
      <div>Anda sedang mengunjungi</div>
      <h1 class="mt-0">
        {{ $route.params.name }}
      </h1>
    </div>

    <form class="w-full max-w-prose flex flex-col gap-4">
      <input type="hidden" name="check-in/id" :value="$route.params.name">
      <input type="hidden" name="check-in/name" :value="user.id">

      <div class="text-lg text-center">
        Sebagai <strong>{{ user.name }}</strong>
      </div>

      <button class="w-full">
        Check In
      </button>
    </form>
  </main>
</template>