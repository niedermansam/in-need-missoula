<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useTagStore } from "@/store";
import {
  BIconXLg,
  BIconArrowUp,
  BIconArrowDown,
  BIconArrowBarDown,
  BIconArrowBarUp,
  BIconEye,
} from "bootstrap-icons-vue";
import { TagStatus } from "@/schemas";

type ButtonRef = null | HTMLHtmlElement;

export default defineComponent({
  props: ["tag"],
  components: {
    BIconXLg,
    BIconArrowUp,
    BIconArrowDown,
    BIconArrowBarDown,
    BIconArrowBarUp,
    BIconEye,
  },
  setup(props) {
    const favoriteButton = ref<ButtonRef>(null);
    const lessInterestedButton = ref<ButtonRef>(null);
    const filterButton = ref<ButtonRef>(null);
    const tagStore = useTagStore();
    const currentFocus = ref<TagStatus>(TagStatus.favorite);

    const buttonStyles = reactive({
      background: "btn-light",
      text: "grey",
    });

    function getButtonStyles() {
      if (!tagStore.tagLookup[props.tag].status) return buttonStyles;
      switch (tagStore.tagLookup[props.tag].status) {
        case TagStatus.none:
          buttonStyles.background = "btn-light";
          buttonStyles.text = "grey";
          break;
        case TagStatus.favorite:
          buttonStyles.background = "btn-success";
          buttonStyles.text = "white";
          break;
        case TagStatus.filtered:
          buttonStyles.background = "btn-danger";
          buttonStyles.text = "white";
          break;
        case TagStatus.lessInterested:
          buttonStyles.background = "btn-secondary";
          buttonStyles.text = "white";
          break;
        default:
          buttonStyles.background = "btn-light";
          buttonStyles.text = "grey";
          break;
      }

      return buttonStyles;
    }

    function handleFocusChange(
      currentElement:
        | typeof favoriteButton.value
        | typeof lessInterestedButton.value
        | typeof filterButton.value
    ) {
      if (!currentElement) return;
      document.activeElement?.setAttribute("tabIndex", "-1");
      currentElement.focus();
      currentElement.setAttribute("tabIndex", "0");
    }

    function focusLessInterested() {
      setTimeout(() => {
        handleFocusChange(lessInterestedButton.value);
        currentFocus.value = TagStatus.lessInterested;
      }, 100);
    }

    function focusFilter() {
      handleFocusChange(filterButton.value);

      setTimeout(() => {
        currentFocus.value = TagStatus.filtered;
      }, 100);
    }

    function focusFavorite() {
      setTimeout(() => {
        handleFocusChange(favoriteButton.value);
        currentFocus.value = TagStatus.favorite;
      }, 100);
    }

    function restoreFocus() {
      switch (currentFocus.value) {
        case TagStatus.favorite:
          favoriteButton.value?.focus();
          break;
        case TagStatus.lessInterested:
          lessInterestedButton.value?.focus();
          break;
        case TagStatus.filtered:
          filterButton.value?.focus();
          break;
        default:
          favoriteButton.value?.focus();
      }
    }

    function bumpPriority(tag: string) {
      tagStore.bumpPriority(tag);
      setTimeout(restoreFocus, 100);
    }

    function dropPriority(tag: string) {
      tagStore.dropPriority(tag);
      setTimeout(restoreFocus, 100);
    }

    return {
      focusLessInterested,
      focusFavorite,
      focusFilter,
      favoriteButton,
      filterButton,
      lessInterestedButton,
      tagStore,
      getButtonStyles,
      buttonStyles,
      bumpPriority,
      dropPriority,
    };
  }, // end setup
});
</script>

<template>
  <div
    class="btn-group tag-btn"
    role="group"
    ref="groupRef"
    @keydown.up="bumpPriority(tag)"
    @keydown.w="bumpPriority(tag)"
    @keydown.down="dropPriority(tag)"
    @keydown.s="dropPriority(tag)"
    @keydown.esc="tagStore.addFilter(tag)"
    @keydown.x="tagStore.addFilter(tag)"
    @keydown.delete="tagStore.resetPriority(tag)"
    @keydown.r.exact="tagStore.resetPriority(tag)"
    @keydown.ctrl.z.exact="tagStore.resetPriorityAll()"
    :aria-label="`${tag} options buttons`"
  >
    <button
      type="button"
      @click="tagStore.toggleFavorite(tag)"
      @keydown.right="focusLessInterested"
      @keydown.left="focusFilter"
      tabIndex="0"
      ref="favoriteButton"
      :class="`btn tag-utility-btn
    ${getButtonStyles().background}`"
    >
      <span v-if="tagStore.isFavorite(tag)"><BIconArrowBarDown /></span>
      <span v-else><BIconArrowUp /></span>
    </button>

    <button
      type="button"
      tabIndex="-1"
      :class="`btn tag-main-btn ${getButtonStyles().background}`"
      @click="tagStore.resetPriority(tag)"
    >
      {{ tag }}
    </button>

    <button
      type="button"
      tabIndex="-1"
      ref="lessInterestedButton"
      @click="tagStore.togglelessInterested(tag)"
      @keydown.right="focusFilter"
      @keydown.left="focusFavorite"
      :class="`btn tag-utility-btn ${getButtonStyles().background}`"
    >
      <span v-if="tagStore.isLessInterested(tag)"><BIconArrowBarUp /></span>
      <span v-else><BIconArrowDown /></span>
    </button>

    <button
      type="button"
      tabIndex="-1"
      ref="filterButton"
      @click="tagStore.toggleFilter(tag)"
      @keydown.left="focusLessInterested"
      @keydown.right="focusFavorite"
      :class="`btn tag-utility-btn ${getButtonStyles().background}`"
    >
      <span v-if="tagStore.isFiltered(tag)"><BIconEye /></span>
      <span v-else><BIconXLg /></span>
    </button>
  </div>
</template>

<style scoped>
.tag-btn {
  margin: 5px;
  width: 300px;
  display: flex;
}

.tag-main-btn {
  align-content: flex-start;
  text-align: left;
}

.tag-utility-btn {
  max-width: 40px;
  justify-self: right;
}
</style>
