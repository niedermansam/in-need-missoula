<script lang="ts">
import { categoryChipStyles } from "@/hooks";
import { useFileStore } from "@/store";
import { ref } from "vue";

export default {
  props: {
    id: { type: String },
  },
  setup(props: { id?: string }) {
    const providesChipStyles = categoryChipStyles;

    const fileStore = useFileStore();

    const file = ref(fileStore.lookup[props.id || ""]);

    return { providesChipStyles, fileStore, file };
  },
};
</script>

<template>
  <div class="border p-3 rounded file-card" style="width: 35vw">
    <div v-if="file && file.Attachments" class="max-h-60 overflow-hidden">
      <img
        :src="file.Attachments[0].thumbnails.large.url"
        class=""
        alt="..."
      />
    </div>
    <div v-if="file">
      <h5 class="text-lg">{{ file.Name }}</h5>

      <p class="mb-2">
        {{ file.Description }}
      </p>

      <a :href="file.URL" target="_blank"><button class="bg-gray-200 p-1 rounded hover:bg-gray-100 hover:text-regal-blue">Open File</button></a>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  font-size: 0.95em;
}
.file-card {
  margin: 10px;
  height: fit-content;
}
.thumb-holder {
  width: 100%;
  height: 150px;
  position: relative;
  overflow: hidden;
}
.thumb-holder img {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
}
</style>
