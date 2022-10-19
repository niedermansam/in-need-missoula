<script lang="ts">
import { useUserStore } from "@/store";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    return {userStore };
  },
});
</script>
<template>
    <button
      class="p-3 bg-gray-100 sticky top-10 rounded-r-md flex items-center align-middle shadow-md border hover:bg-gray-300 ease-in-out transition-all duration-300"
      :class="
        userStore.tagSettings.showTags
          ? 'translate-x-0'
          : '-translate-x-full scale-0 p-0 h-0'
      "
      @click="userStore.toggleShowTags"
    >
      <BIconFunnel class="m-1" />
      Tags
    </button>
</template>
