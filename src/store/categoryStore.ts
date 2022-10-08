import { getCategoryOptions } from '@/hooks/categoryHooks';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import useTagStore from './tagStore'; // eslint-disable-line

const useCategoryStore = defineStore('categoryFilterStore', () => {
  const filters = ref(['']);

  const tagStore = useTagStore();

  const getFilter = computed(() => new RegExp(filters.value.join('|')));

  function isFiltered(category:string) {
    const index = filters.value.indexOf(category);
    if (index === -1) return false;
    return true;
  }

  function addFilter(category:string) {
    filters.value = [...filters.value, category];
    tagStore.updateActiveCategoryTags();
  }

  function removeFilter(category:string) {
    const index = filters.value.indexOf(category);
    if (index < -1) return;
    filters.value.splice(index, 1);
    tagStore.updateActiveCategoryTags();
  }

  function toggleFilter(category:string) {
    const alreadyFiltered = filters.value.indexOf(category) !== -1;

    if (alreadyFiltered) return removeFilter(category);
    return addFilter(category);
  }

  function clearFilters() {
    filters.value = [''];
    tagStore.updateActiveCategoryTags();
  }

  function filterAll() {
    // ! This causes a bug if I try to import the array using a function from the hook
    // ? fixed it using Array.from() to create an immutable array. Hopefully it doesn't break for some reason
    filters.value = getCategoryOptions();
    tagStore.updateActiveCategoryTags();
  }

  return {
    filters,
    getFilter,
    isFiltered,
    toggleFilter,
    addFilter,
    removeFilter,
    clearFilters,
    filterAll,
  };
});

export default useCategoryStore;
