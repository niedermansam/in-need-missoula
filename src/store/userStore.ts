import useLooseSearch from "@/hooks/useLooseSearch";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useTagStore } from '.';  // eslint-disable-line

const useUserStore = defineStore("userStore", () => {
  const tagStore = useTagStore();

  const tagSettings = ref({
    sortTags: false,
    showTags: true,
    tempClose: false,
  });

  const menuOpen = ref(false);

  const handleMenuOpen = function() {
    menuOpen.value = true;
    tagSettings.value.tempClose = true;
  }

  const handleMenuClose = function() {
    menuOpen.value = false;
    tagSettings.value.tempClose = false;
  }

  const handleMenuToggle = function() {
    if(menuOpen.value === true) handleMenuClose();
    else handleMenuOpen();
  }


  const searchString = ref("");
  const searchRegEx = computed(() =>
    RegExp(useLooseSearch(searchString.value) || "", "gi")
  );

  function toggleShowTags() {
    tagSettings.value.showTags = !tagSettings.value.showTags;
  }

  function toggleSortTags() {
    tagSettings.value.sortTags = !tagSettings.value.sortTags;
    tagStore.updateActiveCategoryTags();
  }

  function updateSearchString(search: string) {
    searchString.value = search;
  }

  const favoriteResources = ref<string[]>([]);
  function addFavoriteResource(id: string) {
    favoriteResources.value.push(id);
  }
  function removeFavoriteResource(id: string) {
    const index = favoriteResources.value.indexOf(id);
    favoriteResources.value.splice(index, 1);
  }
  function toggleFavoriteResource(id: string) {
    const isAlreadyFavorite = favoriteResources.value.indexOf(id) !== -1;
    if (isAlreadyFavorite) removeFavoriteResource(id);
    else addFavoriteResource(id);
  }
  return {
    tagSettings,
    toggleShowTags,
    toggleSortTags,
    searchString,
    updateSearchString,
    searchRegEx,
    toggleFavoriteResource,
    favoriteResources,
    menuOpen,
    handleMenuClose,
    handleMenuOpen,
    handleMenuToggle
  };
});

export default useUserStore;
