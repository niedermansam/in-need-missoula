<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";

import { FileCard, TagLinks } from "../components";
import { categoryChipStyles } from "../hooks";
import { useResourceStore, useFileStore } from "../store";

export default defineComponent({
  components: { FileCard, TagLinks },
  props: {
    id: { type: String },
  },
  name: "ResourceDetails",

  setup() {
    const route = useRoute();
    const currentId = route.params.id as string;

    const chipStyles = categoryChipStyles;

    const resourceStore = useResourceStore();
    const fileStore = useFileStore();
    const resource = reactive({ value: resourceStore.lookup[currentId] });

    async function loadAllData() {
      await resourceStore.loadData();
      await fileStore.loadData();
      resource.value = resourceStore.lookup[currentId];
    }
    loadAllData();

    function getFileData() {
      if (resource.value && resource.value["Forms & Files"]) {
        resource.value["Forms & Files"]?.forEach((x) => {
          // console.log(fileStore.lookup[x]);
        });
      }
    }

    getFileData();

    return {
      getFileData,
      fileStore,
      route,
      currentId,
      resourceStore,
      resource,
      chipStyles,
    };
  },
});
</script>

<template>
  <div class="resource container" v-if="resource.value">
    <h1>{{ resource.value.Name }}</h1>

    <span
      class="badge rounded-pill"
      :style="{ backgroundColor: chipStyles(resource.value.Provides).color }"
    >
      {{ chipStyles(resource.value.Provides).emoji }}
      {{ resource.value.Provides }}
    </span>
    <TagLinks :tagArr="resource.value.Tags" />

    <p class="card-text">
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
  </div>
</template>

<style scoped>
.file-container {
  display: flex;
  flex-wrap: true;
}
</style>
