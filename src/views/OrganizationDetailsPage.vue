<template>
  <div class="organization">
    <h1>{{ organization.Name }}</h1>

    <span
      class="badge rounded-pill"
      :style="{ backgroundColor: chipStyles(organization.Expertise).color }"
    >
      {{ chipStyles(organization.Expertise).emoji }}
      {{ organization.Expertise }}
    </span>

    <p class="card-text">
      {{ organization.Notes }}
    </p>
  </div>
</template>

<script lang="ts">
import { categoryChipStyles } from "../hooks/categoryHooks";
import { useOrganizationStore } from "../store/index";
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {
    id: { type: String },
  },
  name: "OrganizationDetails",

  setup(props) {
    const route = useRoute();
    const currentId = route.params.id as string;

    const chipStyles = categoryChipStyles;

    const organizationStore = useOrganizationStore();

    async function loadAllData() {
      await organizationStore.loadData();
    }
    loadAllData();

    const organization = organizationStore.lookup[currentId];

    return {
      route,
      currentId,
      organizationStore,
      organization,
      chipStyles,
    };
  },
});
</script>
