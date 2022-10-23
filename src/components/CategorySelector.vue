<script lang="ts">
import { defineComponent } from "vue";
import {
  useCategoryStore,
  useOrganizationStore,
  useResourceStore,
} from "@/store";
import { categoryChipStyles, getCategoryOptions } from "@/hooks";

export default defineComponent({
  components: {},
  setup() {
    const resourceStore = useResourceStore();
    const orgStore = useOrganizationStore();
    async function loadAllData() {
      await resourceStore.loadData();
      await orgStore.loadData();
    }

    loadAllData();

    const categoryFilters = useCategoryStore();
    const buttonStyles = categoryChipStyles;

    const providesArr = getCategoryOptions();

    return {
      orgStore,
      providesArr,
      categoryFilters,
      resourceStore,
      buttonStyles,
    };
  },
});
</script>

<template>
  <div v-if="providesArr" class="category-section">
    <div
      class="category-row"
    >
      <div class="category-buttons self-center">
        <button
          type="button"
          v-for="cat in providesArr"
          @click="categoryFilters.toggleFilter(cat)"
          :class="`btn w-32 ${
            !categoryFilters.isFiltered(cat)
              ? buttonStyles(cat).class
              : 'border hover:bg-gray-300 bg-gray-100'
          }`"
          :key="cat"
        >
          {{ buttonStyles(cat).emoji }} {{ cat }}
        </button>
      </div>
      <div class="p-3">
        <button
          class="btn bg-blue-500 hover:bg-blue-600 text-white"
          @click="categoryFilters.clearFilters()"
        >
          View All
        </button>
        <button
          class="btn bg-red-500 hover:bg-red-600 text-white"
          @click="categoryFilters.filterAll()"
        >
          Hide All
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-section {
  @apply w-full flex justify-center items-center mb-6;
}

.category-row {
  @apply text-center border rounded w-fit shadow flex flex-wrap items-stretch justify-center m-auto;
}

.category-button {
 @apply flex flex-wrap justify-center p-3;
}
</style>