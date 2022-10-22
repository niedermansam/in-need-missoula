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
  <div v-if="providesArr">
    <button
      type="button"
      v-for="cat in providesArr"
      @click="categoryFilters.toggleFilter(cat)"
      :class="`btn ${
        !categoryFilters.isFiltered(cat)
          ? buttonStyles(cat).class
          : 'border hover:bg-gray-200'
      }`"
      :key="cat"
    >
      {{ buttonStyles(cat).emoji }} {{ cat }}
    </button>
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
</template>
