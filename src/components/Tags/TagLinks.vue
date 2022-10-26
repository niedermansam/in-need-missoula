<script lang="ts">
import { useTagStore } from "@/store";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    tagArr: { type: Array as PropType<string[]>, required: true },
  },
  setup() {
    const tagStore = useTagStore();
    return { tagStore };
  },
});
</script>
<template>
  <span v-for="tag in tagArr.values()" :key="tag">
    <routerLink :to="`../tag/${tagStore.toUrl(tag)}`"
      ><button class="tag-link">
        {{ tag }}
      </button></routerLink
    >
  </span>
</template>

<style scoped >
.tag-link {
  @apply m-1 p-1 bg-slate-100 hover:bg-slate-200 rounded
}
</style>
