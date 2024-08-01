import { useAsyncState } from '@vueuse/core';
import { toRef, watch, type MaybeRef } from 'vue';
import { getGuest } from '../lib/api';

export const useGuest = (id: MaybeRef<string>) => {
  const idRef = toRef(id);
  const { state: data, execute, ...states } = useAsyncState(() => getGuest(idRef.value), null);

  watch(idRef, () => {
    execute();
  });

  return { ...states, data, refresh: execute };
};