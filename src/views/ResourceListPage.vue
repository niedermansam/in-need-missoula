<script lang="ts">
import { defineComponent, TransitionGroup } from "vue";
import {
  useResourceStore,
  useOrganizationStore,
  useCategoryStore,
  useTagStore,
useUserStore,
} from "@/store";
import { CategorySelector, TagSelector, ResourceCard, TagMenuToggle, PageHeader } from "@/components";
import DataError from "../components/DataError.vue";
import { BIconArrowUp } from "bootstrap-icons-vue";
import SelectCategoryNotification from "../components/SelectCategoryNotification.vue";

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
  <div class="grid" style="grid-template-columns: max-content 1fr; grid-template-rows: auto;">
    <TagSelector
      class="relative w-fit"
      :tagArray="tagStore.activeCategoryTags"
    />
    <div class="resourceStore w-full">
      <PageHeader>Resources</PageHeader>
      <CategorySelector class="justify-center text-center" />
      <div>
        <h3 v-if="resourceStore.loading">Loading...</h3>
        <DataError v-if="!resourceStore.loading && resourceStore.error && !resourceStore.dataLoaded" class="text-center" />
        <TransitionGroup
          tag="div"
          name="fade"
          v-if="resourceStore.filteredArray"
          class="flex flex-wrap justify-start"
        >
          <ResourceCard
            v-for="resource in resourceStore.filteredArray"
            class="flex mx-auto my-3"
            :key="resource.id"
            :resource="resource"
          />
        </TransitionGroup>
      </div>
      <SelectCategoryNotification :show="'resources'" v-if="!resourceStore.loading && resourceStore.filteredArray !== undefined && resourceStore.filteredArray.length === 0" />
    </div>
  </div>
</template>

<style scoped>
.resources-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
