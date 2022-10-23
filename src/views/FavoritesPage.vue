<script lang="ts">
import { defineComponent, TransitionGroup } from "vue";
import {
  useResourceStore,
  useOrganizationStore,
  useCategoryStore,
  useTagStore,
  useUserStore,
} from "@/store";
import { ResourceCard, PageHeader } from "@/components";
import DataError from "../components/DataError.vue";

export default defineComponent({
  name: "FavoritesView",
  components: {
    ResourceCard,
    TransitionGroup,
    PageHeader,
    DataError
},
  setup() {
    const resourceStore = useResourceStore();
    const organizationStore = useOrganizationStore();
    const userStore = useUserStore();

    async function loadAllData() {
      await organizationStore.loadData();
      await resourceStore.loadData();
    }
    loadAllData();

    const categoryFilters = useCategoryStore();
    const tagStore = useTagStore();

    return {
      resourceStore,
      categoryFilters,
      tagStore,
      userStore,
    };
  },
});
</script>

<template>
  <div class="resourceStore">
      <PageHeader>Favorites</PageHeader>
    <div>
      <h3 v-if="resourceStore.loading">Loading...</h3>
      <DataError v-if="!resourceStore.loading && resourceStore.error && !resourceStore.dataLoaded" class="text-center" />
      <TransitionGroup
        tag="div"
        name="fade"
        v-if="userStore.favoriteResources.length > 0 && resourceStore.arr"
        class="resources-container"
      >
        <ResourceCard
          v-for="resource in resourceStore.arr.filter(
            (x) => userStore.favoriteResources.indexOf(x.id) !== -1
          )"
          :key="resource.id"
          :resource="resource"
        />
      </TransitionGroup>
      <p class="p2 text-center text-md my-4" v-else>
        Select the star button on resources on the Resources Page to display
        them here.
      </p>
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
