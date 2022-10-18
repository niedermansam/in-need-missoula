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
      class: '',
      background: "",
      favorite: '',
      lessFavorite: '',
      filter: '',
      text: "grey",
    });

    function getButtonStyles() {
      if (!tagStore.tagLookup[props.tag] || !tagStore.tagLookup[props.tag].status) return buttonStyles;
      switch (tagStore.tagLookup[props.tag].status) {
        case TagStatus.none:
          buttonStyles.background = "bg-gray-50";
          buttonStyles.favorite = "hover:bg-green-100";
          buttonStyles.lessFavorite = "hover:bg-gray-100";
          buttonStyles.filter = "hover:bg-red-100";
          buttonStyles.text = "text-gray";
          break;
        case TagStatus.favorite:
          buttonStyles.background = "bg-green-600 hover:bg-green-500";
          buttonStyles.favorite = "bg-green-600 hover:bg-green-500";
          buttonStyles.lessFavorite = "bg-green-600 hover:bg-green-500";
          buttonStyles.filter = "bg-green-600 hover:bg-green-500";
          buttonStyles.text = "text-white";
          break;
        case TagStatus.filtered:
          buttonStyles.background = "bg-red-500 hover:bg-red-400";
          buttonStyles.favorite = "bg-red-500 hover:bg-red-400";
          buttonStyles.lessFavorite = "bg-red-500 hover:bg-red-400";
          buttonStyles.filter = "bg-red-500 hover:bg-red-400";
          buttonStyles.text = "text-white";
          break;
        case TagStatus.lessInterested:
          buttonStyles.background = "bg-gray-400 hover:bg-gray-300";
          buttonStyles.favorite = "bg-gray-400 hover:bg-gray-300";
          buttonStyles.lessFavorite = "bg-gray-400 hover:bg-gray-300";
          buttonStyles.filter = "bg-gray-400 hover:bg-gray-300";
          buttonStyles.text = "text-white";
          break;
        default:
          buttonStyles.background = "bg-gray-400";
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
    class="flex mx-3"
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
      class="w-8 flex justify-center items-center rounded-l"
      :class="`${getButtonStyles().favorite} ${getButtonStyles().text}`"
    >
      <span v-if="tagStore.isFavorite(tag)" ><BIconArrowBarDown /></span>
      <span v-else><BIconArrowUp /></span>
    </button>

    <button
      type="button"
      class="self-stretch w-3/4"
      tabIndex="-1"
      :class="`p-2  ${getButtonStyles().background} ${getButtonStyles().text}`"
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
      class="w-8 flex justify-center items-center"
      :class="`${getButtonStyles().lessFavorite} ${getButtonStyles().text}`"
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
      class="w-8 flex justify-center items-center rounded-r"
      :class="`${getButtonStyles().filter} ${getButtonStyles().text}`"
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
