<script lang="ts">
import { categoryChipStyles } from "../hooks/index";
import { useFileStore } from "../store";
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
  <div class="card file-card" style="width: 35vw">
    <div v-if="file && file.Attachments" class="thumb-holder">
      <img
        :src="file.Attachments[0].thumbnails.large.url"
        class="card-img-top file-thumb"
        alt="..."
      />
    </div>
    <div v-if="file" class="card-body">
      <h5 class="card-title">{{ file.Name }}</h5>

      <p class="card-text">
        {{ file.Description }}
      </p>

      <button class="btn btn-primary">Open File</button>
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
