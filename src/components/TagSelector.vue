<script lang="ts">
import { defineComponent, TransitionGroup } from 'vue';
import { useTagStore, useResourceStore, useUserStore } from '@/store';
import { BIconArrowDownUp, BIconLock, BIconArrowRepeat } from 'bootstrap-icons-vue';
import TagButton from './TagButton.vue';

export default defineComponent({
  components: {
    TagButton, TransitionGroup, BIconArrowDownUp, BIconLock, BIconArrowRepeat,
  },
  setup() {
    const tagFilterStore = useTagStore();
    const resourceStore = useResourceStore();
    const userStore = useUserStore();

    async function loadAllData() {
      await resourceStore.loadData();
      await tagFilterStore.loadAllTags();
    }

    loadAllData();

    tagFilterStore.updateActiveCategoryTags();

    function sortTagList(a:string, b:string) {
      const tagA = tagFilterStore.tagLookup[a].priority;
      const tagB = tagFilterStore.tagLookup[b].priority;

      return tagB - tagA;
    }

    return { tagFilterStore, sortTagList, userStore };
  },
});
</script>

<template>
  <div v-if="tagFilterStore.allTags" class="accordion accordion-flush" id="tag-filter-menu">
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingOne">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-collapseOne"
          aria-expanded="false"
          aria-controls="flush-collapseOne"
        >
          Tags
        </button>
      </h2>
      <div
        id="flush-collapseOne"
        class="accordion-collapse collapse"
        aria-labelledby="flush-headingOne"
        data-bs-parent="#accordionFlushExample"
      >
        <div class="accordion-body">

          <button
            @click="tagFilterStore.resetPriorityAll"
            type="button"
            class="btn btn-outline-secondary">
            <BIconArrowRepeat />
            Reset Tags
          </button>

          <button
            @click="userStore.toggleSortTags"
            type="button"
            class="btn btn-outline-secondary">
            <BIconArrowDownUp v-if="!userStore.tagSettings.sortTags" />
            <BIconLock v-else/>
            {{ userStore.tagSettings.sortTags ? 'Lock Tags' : 'Sort Tags'}}
          </button>
          <div class="tag-container" :style="`--n-tags: ${tagFilterStore.activeCategoryTags.length}`">
            <TransitionGroup
          tag="div"
          name="fade"
          class="tag-container"
          v-if="tagFilterStore.activeCategoryTags[0]" >
          <TagButton
            v-for="tag in tagFilterStore.activeCategoryTags"
            :key="tag || 'tag'"
            :tag="tag"
          />
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag-containerold {
  display: flex;
  align-content: space-around;
  flex-wrap: wrap;
  flex-direction:column;
  max-height: 700px;
}
.tag-container {
  display: grid;
  grid-template-rows: repeat( calc( var(--n-tags) ), auto);
  grid-gap: 10px;
  grid-auto-flow: column;
  justify-content: center;
}
@media screen and (min-width: 700px) {
  .tag-container{
    grid-template-rows: repeat( calc( (var(--n-tags) / 2) + 1) , auto);
  }
}

@media screen and (min-width: 1000px) {
  .tag-container{
    grid-template-rows: repeat( calc( (var(--n-tags) / 3) + 1), auto);
  }
}

@media screen and (min-width: 1400px) {
  .tag-container{
    grid-template-rows: repeat( calc( (var(--n-tags) / 4) + 1), auto);
  }
}

@media screen and (min-width: 1700px) {
  .tag-container{
    grid-template-rows: repeat( calc( (var(--n-tags) / 5) + 1), auto);
  }
}

@media screen and (min-width: 2000px) {
  .tag-container{
    grid-template-rows: repeat( calc( (var(--n-tags) / 6) + 1), auto);
  }
}

@media screen and (min-width: 2300px) {
  .tag-container{
    grid-template-rows: repeat( calc( (var(--n-tags) / 7) + 1), auto);
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
