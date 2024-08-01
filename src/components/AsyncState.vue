<script lang="ts" setup generic="T">
import { useAsyncState } from '@vueuse/core';
import { watch } from 'vue';

const props = defineProps<{
  value: Promise<T>;
  init?: T;
}>();

const {
  state, isLoading, error, execute,
} = useAsyncState<(typeof props.init)>(() => props.value, props.init);

watch(() => props.value, () => {
  execute();
});
</script>

<template>
  <slot :state :is-loading :error :execute />
</template>
