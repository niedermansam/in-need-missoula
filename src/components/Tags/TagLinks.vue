<script lang="ts">
import { TagStatus } from "@/schemas";
import { useTagStore } from "@/store";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    tagArr: { type: Array as PropType<string[]>, required: true },
  },
  setup() {
    const tagStore = useTagStore();

    const getLinkStyles = (tag:string) => {
      if (
        !tagStore.tagLookup[tag] ||
        !tagStore.tagLookup[tag].status
      )
        return '';
      switch (tagStore.tagLookup[tag].status) {
        case TagStatus.none:
          return 'bg-slate-100';
        case TagStatus.favorite:
          return 'bg-green-300';
        case TagStatus.lessInterested:
          return 'bg-gray-500 text-white';
      }
    }
    return { tagStore, getLinkStyles };
  },
});
</script>
<template>
  <span v-for="tag in tagArr.values()" :key="tag">
    <routerLink :to="`../tag/${tagStore.toUrl(tag)}`"
      ><button class="tag-link" :class="getLinkStyles(tag)">
        {{ tag }}
      </button></routerLink
    >
  </span>
</template>

<style scoped >
.tag-link {
  @apply m-1 p-1 hover:bg-slate-200 hover:text-gray-700 rounded
}
</style>
