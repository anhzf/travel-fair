<script lang="ts" setup>
import { parse } from 'valibot';
import { GuestSchema } from '../models/guest';

const data = parse(GuestSchema, {
  name: 'Moh. Abdal Jalil Sisha',
  phone: '6285123456789'
});
</script>

<template>
  <main class="container mx-auto flex flex-col items-center">
    <code class="bg-white/5 px-1 rounded">{{ $route.params.guest }}</code>
    <h1>{{ data.name }}</h1>
    <a :href="`tel:${data.phone}`">+{{ data.phone }}</a>
    <pre>{{ data.questions }}</pre>
  </main>
</template>