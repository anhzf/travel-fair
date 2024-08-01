<script lang="ts" setup>
import { useGuest } from '../composables/use-guest';

const { data } = useGuest();
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <code class="bg-white/5 px-1 rounded text-center">
      {{ data?.id }}
    </code>

    <div class="text-center">
      <h1 class="mb-2">
        {{ data?.name }}
      </h1>
      <a :href="`tel:${data?.phone}`" target="_blank">
        +{{ data?.phone }}
      </a>
    </div>

    <pre>{{ data?.questions }}</pre>
  </main>
</template>