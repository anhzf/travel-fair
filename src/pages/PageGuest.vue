<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGuest } from '../composables/use-guest';
import { useSession } from '../composables/use-session';

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.guest as string);

const { data: profile } = useGuest(id);
const { data: session } = useSession();

const data = computed(() => profile.value ?? session.value);

if (!data.value) router.push({ name: 'welcome' });
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <code class="bg-white/5 px-1 rounded text-center">
      {{ id ?? data?.id }}
    </code>

    <template v-if="data">
      <div class="text-center">
        <h1 class="mb-2">
          {{ data?.name }}
        </h1>
        <a :href="`tel:${data?.phone}`" target="_blank">
          +{{ data?.phone }}
        </a>
      </div>

      <pre class="container">{{ data?.questions }}</pre>
      <pre class="container">{{ data?.visits }}</pre>
    </template>
  </main>
</template>