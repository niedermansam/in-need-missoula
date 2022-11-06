<script lang="ts">
import { categoryChipStyles } from "@/hooks/categoryHooks";
import type { OrganizationSchema } from "@/schemas/OrganizationSchemas";
import { BIconEnvelope, BIconTelephone } from "bootstrap-icons-vue";

export default {
  props: {
    organization: { type: Object as () => OrganizationSchema },
  },
  components: { BIconTelephone, BIconEnvelope },
  setup() {
    const providesChipStyles = categoryChipStyles;

    return { providesChipStyles };
  },
};
</script>

<template>
  <div class="card-container flex">
    <div v-if="organization" class="card-body p-2 flex justify-items-stretch">
      <div class="organization-header">
        <h5 class="text-2xl">{{ organization.Name }}</h5>

        <span class="category-tag">
          {{ providesChipStyles(organization.Expertise).emoji }}
          {{ organization.Expertise }}
        </span>
      </div>
      <p class="phone" v-if="organization.Phone">
        <BIconTelephone class="mr-1" /> {{ organization.Phone }}
      </p>
      <p class="email" v-if="organization.Email">
        <BIconEnvelope class="mr-1" /> {{ organization.Email }}
      </p>

      <p class="organization-details">
        {{ organization.Notes }}
      </p>

      <router-link
        :to="'/organizations/' + organization.id"
        class="btn-link-lg mt-auto"
      >
        More Information</router-link
      >
    </div>
  </div>
</template>

<style scoped>
.organization-card {
  @apply border rounded-sm m-2 p-2 shadow;
}

.organization-header {
  @apply flex items-center mb-2;
}

.category-tag {
  @apply ml-1 text-gray-500;
}

.phone, .email {
  @apply flex items-center;
}

.organization-details {
  @apply mt-2 mb-4;
}
</style>