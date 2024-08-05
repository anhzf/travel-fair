import { createGlobalState, useLocalStorage, whenever } from '@vueuse/core';
import { RESOURCE_PREFIX } from '../constants';
import { useGuest } from './use-guest';

const SESSION_KEY = `${RESOURCE_PREFIX}session`;

export const useSession = createGlobalState(() => {
  const session = useLocalStorage(SESSION_KEY, '');
  const { data, isLoading, refresh, error } = useGuest(session);
  const update = async (id: string) => {
    session.value = id;
  };

  whenever(() => data.value === null, () => {
    console.warn('Session not found, resetting session');
    session.value = '';
  });

  return {
    update,
    data,
    isLoading,
    refresh,
    error,
  };
});