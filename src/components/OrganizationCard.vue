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
  <div class="border rounded-sm m-2 p-2" style="width: 100%">
    <div v-if="organization" class="p-2">
      <div class="flex items-center mb-2">
        <h5 class="text-2xl">{{ organization.Name }}</h5>

        <span class="ml-1 text-gray-500">
          {{ providesChipStyles(organization.Expertise).emoji }}
          {{ organization.Expertise }}
        </span>
      </div>
      <p class="flex items-center" v-if="organization.Phone">
        <BIconTelephone class="mr-1" /> {{ organization.Phone }}
      </p>
      <p class="flex items-center" v-if="organization.Email">
        <BIconEnvelope class="mr-1" /> {{ organization.Email }}
      </p>

      <p class="mt-2 mb-4">
        {{ organization.Notes }}
      </p>

      <router-link
        :to="'/organizations/' + organization.id"
        class="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
      >
        More Information</router-link
      >
    </div>
  </div>
</template>
