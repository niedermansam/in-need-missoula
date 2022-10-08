import { reactive, watchEffect } from 'vue';

export interface FetchState<T extends Record<string, any>> {
    loading: boolean;
    error: string;
    data: T | null;
}

export default function useFetch<T extends Record<string, any>>(url:string) {
  const state = reactive<FetchState<T>>({
    loading: false,
    error: '',
    data: null,
  });

  const fetchData = async () => {
    state.loading = true;
    state.data = null;
    state.error = '';

    try {
      const response = await fetch(
        url,
        {
          headers: {
            accept: 'application/json',
          },
        },
      );

      if (response.ok) {
        const json = await response.json();
        state.data = json;
      } else {
        state.error = 'Error fetching data';
      }
    } catch (error: any) {
      state.error = `Error fetching data. ${error.message}`;
    }
    state.loading = false;
  };

  watchEffect(() => {
    fetchData();
  });

  return state;
}
