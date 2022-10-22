<script lang="ts">
import { categoryChipStyles } from "@/hooks";
import { useOrganizationStore, useResourceStore } from "@/store";
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";
import type { ResourceSchema } from "@/schemas";
import { ResourceCard, TagLinks } from "@/components";
import { onlyUnique } from "@/hooks";

export default defineComponent({
  props: {
    id: { type: String },
  },
  components: {
    ResourceCard,
    TagLinks,
  },
  name: "OrganizationDetails",

  setup() {
    const route = useRoute();
    const currentId = ref(route.params.id as string);

    function updateRoute() {
      currentId.value = route.params.id as string;
      organization.value = organizationStore.lookup[currentId.value];
    }

    watch(() => route.params.id, updateRoute);

    const chipStyles = categoryChipStyles;

    const organizationStore = useOrganizationStore();
    const resourceStore = useResourceStore();

    async function loadAllData() {
      await organizationStore.loadData();
      await resourceStore.loadData();
      organization.value = organizationStore.lookup[currentId.value];

      /* TODO: clean up this shit
      Gets a list of resources that the organization can help with, but does not administer */
      resourceList.value = organization.value["Resources Available"]
        ? organization.value["Resources Available"]
            .map((id: string) => resourceStore.lookup[id])
            .filter((resource: ResourceSchema) =>
              organization.value["Administer of"]
                ? organization.value["Administer of"].indexOf(resource.id) ===
                  -1
                : true
            )
        : [];

      administersList.value = organization.value["Administer of"]
        ? organization.value["Administer of"].map(
            (id: string) => resourceStore.lookup[id]
          )
        : [];

      tagList.value = organization.value["Resources Available"]
        ? organization.value["Resources Available"]
            .map((resourceId: string) => {
              const currentResource = resourceStore.lookup[resourceId];
              return currentResource.Tags;
            })
            .flat()
            .filter(onlyUnique)
        : [];
    }
    loadAllData();

    const organization = ref(organizationStore.lookup[currentId.value]);
    const resourceList = ref<ResourceSchema[]>([]);
    const administersList = ref<ResourceSchema[]>([]);
    const tagList = ref<string[]>([]);

    return {
      route,
      currentId,
      organizationStore,
      organization,
      administersList,
      resourceList,
      tagList,
      chipStyles,
    };
  },
});
</script>

<template>
  <div v-if="organization" class="organization p-4">
    <h1 class="text-3xl mb-3">{{ organization.Name }}</h1>
    <p v-if="organization.Phone" class="p-1">phone: {{ organization.Phone }}</p>
    <p v-if="organization.Email" class="p-1">email: {{ organization.Email }}</p>
    <p v-if="organization.URL" class="p-1">
      website:
      <a :href="organization.URL" target="_blank"> {{ organization.URL }}</a>
    </p>

    <div v-if="tagList.length" class="my-3 flex items-center">
      <p class="text-lg7">Resource Tags:</p>
      <TagLinks :tagArr="tagList" />
    </div>

    <p class="my-3">
      {{ organization.Notes }}
    </p>

    <div v-if="administersList.length > 0">
      <h2 class="text-xl">
        {{ organization.Name }} offers the following resources:
      </h2>
      <div style="display: flex; flex-wrap: wrap">
        <ResourceCard
          v-for="resource in administersList"
          class="m-2"
          :key="resource.id"
          :resource="resource"
        />
      </div>
    </div>
    <div v-if="resourceList.length > 0">
      <h2 class="text-xl">{{ organization.Name }} can help with:</h2>
      <div style="display: flex; flex-wrap: wrap">
        <ResourceCard
          v-for="resource in resourceList"
          class="m-2"
          :key="resource.id"
          :resource="resource"
        />
      </div>
    </div>

    <RouterLink to="/organizations/"
      ><button
        class="p-2 rounded bg-blue-200 hover:bg-blue-400 hover:text-white"
      >
        See More Organizations
      </button></RouterLink
    >
  </div>
</template>
