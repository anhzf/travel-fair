<script lang="ts" setup>
import { isValiError } from 'valibot';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useGuest } from '../composables/use-guest';
import { useLoading } from '../composables/use-loading';
import { checkIn } from '../lib/api';
import { getValiErrorMessages } from '../utils/error';

const route = useRoute();

const [isLoading, loading] = useLoading();
const errors = ref<string[]>([]);

const { data: guest } = useGuest();

const isCheckedIn = ref(false);

const onSubmit = async () => {
  try {
    await loading(checkIn(guest.value?.id as string, route.params.name as string));
    isCheckedIn.value = true;
  } catch (err) {
    errors.value = isValiError(err)
      ? getValiErrorMessages(err)
      : [String(err)];
  }
}
</script>

<template>
  <main class="container m-auto flex flex-col justify-center items-center gap-6">
    <div>
      <div v-if="isCheckedIn" class="text-green">
        Terima kasih telah mengunjungi
      </div>
      <div v-else>
        Anda sedang mengunjungi
      </div>
      <h1 class="mt-0">
        {{ $route.params.name }}
      </h1>
    </div>

    <form class="w-full max-w-prose flex flex-col gap-4" @submit.prevent="onSubmit">
      <input type="hidden" name="check-in/id" :value="$route.params.name">
      <input type="hidden" name="check-in/name" :value="guest?.id">

      <div class="text-lg text-center">
        Sebagai <strong>{{ guest?.name }}</strong>
      </div>

      <div v-if="isCheckedIn"
        class="w-full text-xl px-2 py-3 bg-green-900/50 text-green-100 text-center rounded border border-solid border-green-400">
        Anda telah check-in ✓
      </div>

      <button v-else :disabled="isLoading"
        :class="['w-full text-xl py-3 @dark:shadow-white/10', isLoading ? 'shadow-none' : 'shadow-xl']">
        Check In
      </button>
    </form>

    <ul v-if="errors.length">
      <li v-for="error in errors" :key="error" class="text-red-500">{{ error }}</li>
    </ul>
  </main>
</template>