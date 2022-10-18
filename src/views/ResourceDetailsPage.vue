<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { FileCard, TagLinks } from "../components";
import { categoryChipStyles } from "../hooks";
import { useResourceStore, useFileStore, useOrganizationStore } from "../store";

export default defineComponent({
  components: { FileCard, TagLinks },
  props: {
    id: { type: String },
  },
  name: "ResourceDetails",

  setup() {
    const route = useRoute();
    const currentId = route.params.id as string;

    const resourceStore = useResourceStore();
    const fileStore = useFileStore();
    const organizationStore = useOrganizationStore();

    async function loadAllData() {
      await resourceStore.loadData();
      await organizationStore.loadData();
      await fileStore.loadData();
      resource.value = resourceStore.lookup[currentId];
      administeringOrg.value =
        resource.value && resource.value["Administering Org"]
          ? resource.value["Administering Org"][0]
          : undefined;
    }
    loadAllData();

    const chipStyles = categoryChipStyles;

    const resource = reactive({ value: resourceStore.lookup[currentId] });

    const administeringOrg = ref(
      resource.value && resource.value["Administering Org"]
        ? resource.value["Administering Org"][0]
        : undefined
    );

    function getFileData() {
      if (resource.value && resource.value["Forms & Files"]) {
        resource.value["Forms & Files"]?.forEach((x) => {
          console.log(fileStore.lookup[x]);
        });
      }
    }

    getFileData();

    return {
      getFileData,
      resourceStore,
      organizationStore,
      administeringOrg,
      fileStore,
      route,
      currentId,
      resource,
      chipStyles,
    };
  },
});
</script>

<template>
  <div class="resource container" v-if="resource.value">
    <div class="p-2">
      <div class="flex items-center mb-2">
        <h5 class="text-2xl">{{ resource.value.Name }}</h5>

        <span class="ml-1 text-gray-500">
          {{ chipStyles(resource.value.Provides).emoji }}
          {{ resource.value.Provides }}
        </span>
      </div>
    </div>
    <div></div>

    <div class="flex items-center">
      <p class="m-2">Tags:</p>
      <TagLinks :tagArr="resource.value.Tags" />
    </div>
    <p class="p-2">
      {{ resource.value.Notes }}
    </p>
    <div
      v-if="resource.value['Forms & Files'] && fileStore.loaded"
      class="file-container"
    >
      <FileCard
        v-for="file in resource.value['Forms & Files']"
        :key="file"
        :id="file"
      />
    </div>

    <a :href="resource.value.URL" target="_blank"
      ><button
        class="p-2 m-2 rounded bg-blue-200 hover:bg-blue-400 hover:text-white"
      >
        Official Website
      </button></a
    >
    <span v-if="administeringOrg">
      <RouterLink :to="`/organizations/${resource.value['Administering Org']}`"
        ><button
          class="p-2 rounded bg-blue-200 hover:bg-blue-400 hover:text-white"
        >
          {{ organizationStore.lookup[administeringOrg].Name }}
        </button></RouterLink
      >
    </span>
  </div>
</template>

<style scoped>
.file-container {
  display: flex;
  flex-wrap: true;
}
</style>
