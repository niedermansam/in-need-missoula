<script lang="ts">
import { defineComponent, ref, TransitionGroup } from "vue";
import type { PropType } from "vue";
import { useTagStore, useResourceStore, useUserStore } from "@/store";
import {
  BIconArrowDownUp,
  BIconLock,
  BIconArrowRepeat,
  BIconXLg,
  BIconFunnel,
} from "bootstrap-icons-vue";
import TagButton from "@/components/Tags/TagButton.vue";

export default defineComponent({
  props: {
    tagArray: Array as PropType<string[]>,
  },
  components: {
    TagButton,
    TransitionGroup,
    BIconArrowDownUp,
    BIconLock,
    BIconXLg,
    BIconArrowRepeat,
    BIconFunnel,
  },
  setup() {
    const resourceStore = useResourceStore();
    const userStore = useUserStore();
    const tagStore = useTagStore();

    async function loadAllData() {
      await resourceStore.loadData();
      await tagStore.loadAllTags();
    }

    loadAllData();

    tagStore.updateActiveCategoryTags();

    function sortTagList(a: string, b: string) {
      const tagA = tagStore.tagLookup[a].priority;
      const tagB = tagStore.tagLookup[b].priority;

      return tagB - tagA;
    }

    const isOpen = ref(true);

    return { sortTagList, userStore, tagStore, isOpen };
  },
});
</script>

<template>

  <div
    class="overflow-y-auto overflow-x-visible sticky top-0"
    style="height: 95vh;"
  >
    <aside
      v-if="tagArray"
      class="transform w-64 overflow-y-auto overflow-x-hidden bg-white ease-in-out transition-all duration-300 z-30 rounded-r border-r shadow"
      id="tag-filter-menu"
      :class="userStore.tagSettings.showTags ? 'w-0 h-0' : 'w-full'"
    >
      <div class="sticky top-0 left-0 bg-white overflow-y-scroll w-64"></div>
      <button
        class="w-full flex justify-center py-2 bg-red-500 mb-2 text-white text-lg hover:bg-red-300 sticky top-0 z-10"
        @click="userStore.toggleShowTags"
      >
        <BIconXLg />
      </button>
      <div
        class="flex justify-center mb-2 sticky top-8 bg-white z-10 shadow-sm py-2"
      >
        <button
          @click="tagStore.resetPriorityAll"
          type="button"
          class="flex border p-2 rounded items-center text-gray-500 mr-6"
        >
          <BIconArrowRepeat />
          Reset Tags
        </button>

        <button
          @click="userStore.toggleSortTags"
          type="button"
          class="flex border p-2 rounded items-center text-gray-500"
        >
          <span class="mr-2">
            <BIconArrowDownUp v-if="!userStore.tagSettings.sortTags" />
            <BIconLock v-else />
          </span>
          <span>
            {{ userStore.tagSettings.sortTags ? "Lock Tags" : "Sort Tags" }}
          </span>
        </button>
      </div>
      <div>
        <TransitionGroup
          tag="div"
          name="fade"
          class="flex flex-col item-self-stretch justify-items-stretch"
          v-if="tagArray[0]"
        >
          <TagButton
            v-for="tag in tagArray"
            class="flex justify-self-stretch self-stretch my-1"
            :key="tag || 'tag'"
            :tag="tag"
          />
        </TransitionGroup>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.tag-containerold {
  display: flex;
  align-content: space-around;
  flex-wrap: wrap;
  flex-direction: column;
  max-height: 700px;
}
.tag-container {
  display: grid;
  grid-template-rows: repeat(calc(var(--n-tags)), auto);
  grid-gap: 10px;
  grid-auto-flow: column;
  justify-content: center;
}
@media screen and (min-width: 700px) {
  .tag-container {
    grid-template-rows: repeat(calc((var(--n-tags) / 2) + 1), auto);
  }
}

@media screen and (min-width: 1000px) {
  .tag-container {
    grid-template-rows: repeat(calc((var(--n-tags) / 3) + 1), auto);
  }
}

@media screen and (min-width: 1400px) {
  .tag-container {
    grid-template-rows: repeat(calc((var(--n-tags) / 4) + 1), auto);
  }
}

@media screen and (min-width: 1700px) {
  .tag-container {
    grid-template-rows: repeat(calc((var(--n-tags) / 5) + 1), auto);
  }
}

@media screen and (min-width: 2000px) {
  .tag-container {
    grid-template-rows: repeat(calc((var(--n-tags) / 6) + 1), auto);
  }
}

@media screen and (min-width: 2300px) {
  .tag-container {
    grid-template-rows: repeat(calc((var(--n-tags) / 7) + 1), auto);
  }
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
