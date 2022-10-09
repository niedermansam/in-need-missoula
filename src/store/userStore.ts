import useLooseSearch from '@/hooks/useLooseSearch';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useTagStore } from '.';  // eslint-disable-line

const useUserStore = defineStore('userStore', () => {
  const tagStore = useTagStore();

  const tagSettings = ref({
    sortTags: false,
  });

  const searchString = ref('');
  const searchRegEx = computed(() => RegExp(useLooseSearch(searchString.value) || '', 'gi'));

  function toggleSortTags() {
    tagSettings.value.sortTags = !tagSettings.value.sortTags;
    tagStore.updateActiveCategoryTags();
  }

  function updateSearchString(search:string) {
    searchString.value = search;
  }
  return {
    tagSettings, toggleSortTags, searchString, updateSearchString, searchRegEx,
  };
});

export default useUserStore;
