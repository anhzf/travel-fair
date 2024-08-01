import { createGlobalState, useAsyncState, useSessionStorage, whenever } from '@vueuse/core';
import { RESOURCE_PREFIX } from '../constants';
import { getGuest } from '../lib/api';

const GUEST_KEY = `${RESOURCE_PREFIX}guest`;

export const useGuest = createGlobalState(() => {
  const session = useSessionStorage(GUEST_KEY, '');
  const { state, isLoading, execute, error } = useAsyncState(() => getGuest(session.value), null);
  const updateSession = async (id: string) => {
    session.value = id;
    await execute();
  };

  whenever(() => state.value === null, () => {
    console.warn('Guest not found, resetting session');
    session.value = '';
  });

  return {
    updateSession,
    data: state,
    isLoading,
    refresh: execute,
    error,
  };
});