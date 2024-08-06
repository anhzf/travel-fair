<script lang="ts" setup>
import { until } from '@vueuse/core';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AsyncState from '../components/AsyncState.vue';
import { useGuest } from '../composables/use-guest';
import { useSession } from '../composables/use-session';
import { getAttachment } from '../lib/api';

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.guest as string);

const { data: profile, isLoading: isProfileLoading } = useGuest(id);
const { data: session, isLoading: isSessionLoading } = useSession();

const data = computed(() => profile.value ?? session.value);

Promise.all([
  until(isProfileLoading).toBe(false),
  until(isSessionLoading).toBe(false),
])
  .then(() => {
    if (!data.value) router.push({ name: 'welcome' });
  });
</script>

<template>
  <main class="container mx-auto flex flex-col items-center gap-6">
    <img src="/logo.png" alt="Logo" width="160" height="100" class="self-center object-contain">

    <code class="bg-gray/5 px-1 rounded text-center">
      {{ data?.id ?? id }}
    </code>

    <template v-if="data">
      <div class="text-center">
        <h1 class="text-$theme mb-2">
          {{ data.name }}
        </h1>

        <a :href="`tel:+${data.phone}`" target="_blank">
          {{ data.phone }}
        </a>
      </div>

      <ol class="w-full max-w-prose">
        <li v-for="(answer, question) in data.questions" :key="question">
          <div class="font-semibold">{{ question }}</div>

          <AsyncState v-if="(typeof answer === 'string' && answer.startsWith('gs://'))" :value="getAttachment(answer)"
            #="{ state, isLoading, error }">
            <div v-if="state">
              <a :href="state.url" target="_blank" rel="noopener noreferrer">
                {{ state.name }}
              </a>
            </div>
            <div v-else-if="isLoading">
              Loading...
            </div>
            <div v-else-if="error" class="text-red-500">
              {{ error }}
            </div>
            <div v-else>
              {{ answer }}
            </div>
          </AsyncState>

          <div v-else-if="Array.isArray(answer)">
            <ul>
              <li v-for="item in answer" :key="item">
                {{ item }}
              </li>
            </ul>
          </div>

          <div v-else>
            {{ answer }}
          </div>
        </li>
      </ol>

      <section class="w-full flex flex-col">
        <h2 class="text-$theme">Daftar Kunjungan</h2>

        <ol class="w-full max-w-prose">
          <li v-for="(detail, visit) in data.visits.details" :key="visit">
            <span class="font-semibold">
              {{ visit }}
            </span>
            <span class="text-gray-400"> x{{ detail.count }}</span>
          </li>
        </ol>
      </section>
    </template>

    <div v-else-if="isProfileLoading || isSessionLoading">
      Loading...
    </div>
  </main>
</template>