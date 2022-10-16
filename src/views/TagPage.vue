<script lang="ts">
import { useOrganizationStore, useResourceStore, useUserStore } from "../store";
import { ResourceCard } from "../components";
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "TagPage",
  components: {
    ResourceCard,
  },
  props: {
    tag: { type: String },
  },
  setup(state) {
    const route = useRoute();

    const selectedTag = route.params.id;

    const resourceStore = useResourceStore();
    const organizationStore = useOrganizationStore();

    async function loadAllData() {
      await organizationStore.loadData();
      await resourceStore.loadData();
    }
    loadAllData();

    return {
      resourceStore,
    };
  },
});
</script>

<template>
  <div>
    <div class="tag-page">
      <h1>Tag</h1>
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
