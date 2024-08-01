import { ref } from 'vue';

export const useLoading = () => {
  const state = ref(false);
  const loading = async <T>(promise: Promise<T>) => {
    state.value = true;
    return promise.finally(() => {
      state.value = false;
    });
  };

  return [state, loading] as const;
}