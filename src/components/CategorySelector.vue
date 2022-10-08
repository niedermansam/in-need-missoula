<script lang="ts">
import { defineComponent } from 'vue';
import { useCategoryStore, useOrganizationStore, useResourceStore } from '@/store';
import { categoryChipStyles, getCategoryOptions } from '@/hooks';

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
      :class="`btn ${!categoryFilters.isFiltered(cat) ? '' : 'btn-light'}`"
      :key="cat"
      :style="!categoryFilters.isFiltered(cat) ?
        `background-color: ${buttonStyles(cat).color}` :
        ''"
    >
    {{buttonStyles(cat).emoji}}  {{ cat }}
    </button>
    <button
        class = 'btn btn-primary'
        @click="categoryFilters.clearFilters()">
        View All
    </button>
    <button
        class = 'btn btn-danger'
        @click="categoryFilters.filterAll()">
        Hide All
    </button>
  </div>
</template>

<style scoped>
button {
    margin: 5px;
    font-weight: strong;
}
</style>
