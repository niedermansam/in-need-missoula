<script lang="ts">
import { useOrganizationStore, useResourceStore, useTagStore, useUserStore } from "../store";
import { ResourceCard } from "../components";
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";
import TagSelector from "../components/TagSelector.vue";

export default defineComponent({
  name: "TagPage",
  components: {
    ResourceCard,
    TagSelector
},
  setup(state) {
    const $route = useRoute();
    const tagStore = useTagStore();

    const resourceStore = useResourceStore();

    async function loadAllData() {
      await resourceStore.loadData();
    }
    loadAllData();

    const selectedTag = ref(($route.params.tag as string).replace(/_/g,' '));

    function updateSelectedTag() {
      selectedTag.value = ($route.params.tag as string).replace(/_/g,' ');
    }

    watch(() => $route.params.tag, updateSelectedTag)


    return {
      resourceStore, selectedTag, tagStore
    };
  },
});
</script>

<template>
  <div v-if="tagStore.getRelatedTags(selectedTag)" class="grid" style="grid-template-columns: max-content 1fr">
    <TagSelector :tagArray = "tagStore.getRelatedTags(selectedTag)"
      class="relative w-fit" />
    <div class="tag-page">
      <h1 class="text-3xl p-3">{{tagStore.fromUrl(selectedTag)}}</h1>
    <h3 v-if="resourceStore.loading">Loading...</h3>
    <h3 v-if="!resourceStore.loading && resourceStore.error">
      {{ resourceStore.error }}
    </h3>
    <div class="resourceStore w-full">
    <TransitionGroup
      tag="div"
      name="fade"
      v-if="resourceStore"
      style="display: flex; flex-wrap: wrap"
    >
      <ResourceCard
        v-for="resource in resourceStore.getByTag"
        style="margin: 5px"
        :key="resource.id"
        :resource="resource"
      />
    </TransitionGroup>
  </div>
    </div>
  </div>
</template>


<style scoped>
.resources-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
