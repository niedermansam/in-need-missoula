<script lang="ts">
import { useOrganizationStore, useResourceStore, useUserStore } from "../store";
import { ResourceCard } from "../components";
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "SearchPage",
  components: {
    ResourceCard,
  },
  props: {
    q: { type: String },
  },
  setup(state) {
    const userStore = useUserStore();
    const route = useRoute();
    const query = route.query.q;

    if (typeof query !== "string" && query) {
      query?.toString();
    }

    const resourceStore = useResourceStore();
    const organizationStore = useOrganizationStore();
    async function loadAllData() {
      await organizationStore.loadData();
      await resourceStore.loadData();
    }
    loadAllData();

    const resourceSearchResults = ref(resourceStore.userSearchResults());

    return {
      resourceStore,
      resourceSearchResults,
      userStore,
    };
  },
});
</script>

<template>
  <div>
    <div class="search">
      <h1 class="text-3xl">Search Results</h1>
    </div>
    <h3 v-if="resourceStore.loading">Loading...</h3>
    <h3 v-if="!resourceStore.loading && resourceStore.error">
      {{ resourceStore.error }}
    </h3>
    <TransitionGroup
      tag="div"
      name="fade"
      v-if="resourceStore"
      style="display: flex; flex-wrap: wrap"
    >
      <ResourceCard
        v-for="resource in resourceStore.userSearchResults()"
        style="margin: 5px"
        :key="resource.id"
        :resource="resource"
      />
    </TransitionGroup>
  </div>
</template>
