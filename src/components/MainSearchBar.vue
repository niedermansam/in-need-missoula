<script lang="ts">
import { defineComponent, ref } from "vue";
import { BIconSearch } from "bootstrap-icons-vue";
import { useUserStore } from "../store";

export default defineComponent({
  components: { BIconSearch },
  setup() {
    const searchText = ref<string>("");
    const inputBar = ref<HTMLInputElement | null>(null);
    const userStore = useUserStore();

    function handleInput() {
      if (!inputBar.value) return;
      const searchValue = inputBar.value.value.replace(/ /g, "+");
      searchText.value = searchValue;
      userStore.updateSearchString(searchValue);
    }

    return {
      searchText,
      handleInput,
      inputBar,
    };
  },
});
</script>

<template>
  <div class="input-group mb-3">
    <input
      ref="inputBar"
      @input="handleInput"
      type="search"
      class="form-control"
      aria-label="Search Form"
    />
    <router-link :to="`/search/?q=${searchText}`">
      <button type="button" class="input-group-text btn btn-outline-secondary">
        <BIconSearch />
      </button>
    </router-link>
  </div>
</template>

<style scoped></style>
