<script lang="ts">
import { defineComponent, TransitionGroup } from "vue";
import {
  useResourceStore,
  useOrganizationStore,
  useCategoryStore,
  useTagStore,
  useUserStore,
} from "@/store";
import { CategorySelector, SelectCategoryNotification, DataError, TagSelector, ResourceCard, TagMenuToggle, PageHeader } from "@/components";
import { BIconArrowUp } from "bootstrap-icons-vue";

export default defineComponent({
  name: "ResourcesView",
  components: {
    ResourceCard,
    CategorySelector,
    TagSelector,
    TransitionGroup,
    TagMenuToggle,
    PageHeader,
    DataError,
    BIconArrowUp,
    SelectCategoryNotification
},
  setup() {
    const resourceStore = useResourceStore();
    const organizationStore = useOrganizationStore();
    const tagStore = useTagStore();
    const userStore = useUserStore();

    async function loadAllData() {
      await organizationStore.loadData();
      await resourceStore.loadData();
    }
    loadAllData();

    const categoryFilters = useCategoryStore();

    return { resourceStore, categoryFilters, tagStore, userStore, };
  },
});
</script>

<template>
  <TagMenuToggle />
  <div>
    <Teleport to="#sidebar">
    <TagSelector
      class="relative w-fit"
      :tagArray="tagStore.activeCategoryTags"
    /></Teleport>
    <div class="resource-container">
      <PageHeader>Resources</PageHeader>
      <CategorySelector class="category-selector" />
      <div>
        <h3 v-if="resourceStore.loading">Loading...</h3>
        <DataError 
          v-if="!resourceStore.loading && resourceStore.error && !resourceStore.dataLoaded" 
          class="text-center" />
        <TransitionGroup
          tag="div"
          name="fade"
          v-if="resourceStore.filteredArray"
          class="card-group"
        >
          <ResourceCard
            v-for="resource in resourceStore.filteredArray"
            class="card"
            :key="resource.id"
            :resource="resource"
          />
        </TransitionGroup>
      </div>
      <SelectCategoryNotification :show="'resources'" 
        v-if="!resourceStore.loading && resourceStore.filteredArray !== undefined && resourceStore.filteredArray.length === 0" />
    </div>
  </div>
</template>

<style scoped>
.resource-container {
  @apply w-full;
}

.category-selector {
  @apply justify-center text-center;
}


</style>
