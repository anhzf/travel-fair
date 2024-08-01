<script lang="ts" setup>
const data = [
  { id: '1', name: 'Moh. Abdal Jalil Sisha' },
  { id: '2', name: 'Muh. Sumbul' }
];
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <div class="text-center">
      <h1 class="mb-0">
        {{ $route.params.name }}
      </h1>
      <div>Total Kunjungan: {{ NaN }}</div>
    </div>

    <ul class="w-full max-w-prose">
      <li v-for="el in data">
        <RouterLink :to="{ name: 'guest', params: { guest: el.id } }">
          {{ el.name }}
        </RouterLink>
      </li>
    </ul>
  </main>
</template>