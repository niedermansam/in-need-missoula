<script lang="ts">
import { categoryChipStyles } from '@/hooks/categoryHooks';
import { OrganizationSchema } from '@/schemas/OrganizationSchemas';

export default {
  props: {
    organization: { type: Object as () => OrganizationSchema },
  },
  setup() {
    const providesChipStyles = categoryChipStyles;

    return { providesChipStyles };
  },
};
</script>

<template>
  <div class="card" style="width: 100%">
    <div v-if="organization" class="card-body">
      <h5 class="card-title">{{ organization.Name }}</h5>

      <span
      class="badge rounded-pill"
      :style="{ backgroundColor: providesChipStyles(organization.Expertise).color }">
        {{providesChipStyles(organization.Expertise).emoji}} {{organization.Expertise}}
      </span>

      <p class="card-text">
        {{ organization.Notes }}
      </p>

      <router-link :to="'/organizations/' + organization.id"
      class="btn btn-primary">
      More Information</router-link>
    </div>
  </div>
</template>
