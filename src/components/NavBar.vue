<script lang="ts">
import { defineComponent, ref, Transition } from "vue";
import MainSearchBar from "@/components/MainSearchBar.vue";
import NavLinks from "./NavLinks.vue";
import { BIconList } from "bootstrap-icons-vue";

export default defineComponent({
  components: { MainSearchBar, NavLinks, BIconList, Transition },
  setup() {
    const mobileMenuOpen = ref(false);
    return { mobileMenuOpen }
  }
});
</script>

<template>
  <div class="relative bg-white" style="grid-area: header">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div
        class="flex items-center justify-between border-b-2 border-gray-100 py-6 md:space-x-10"
      >
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <a href="#">
            <img class="h-8 w-auto sm:h-10" src="../assets/logo.png" alt="" />
          </a>
          <a class="self-center text-xl mx-2" href="#">Need Help Missoula</a>
        </div>
        <div class="flex items-center">
        <button 
          class="p-2 hover:bg-gray-300 rounded block sm:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen">
          <BIconList class="text-2xl text-gray-600" />
        </button>
        <NavLinks 
          class="hidden sm:block"/>
      </div>
    </div>
  </div>
        <Transition name="expand">
        <NavLinks 
          class="flex flex-col mr-5 fixed right-0 bg-white sm:hidden rounded-b-lg border"
          v-if="mobileMenuOpen"/>
        </Transition>
  </div>
</template>

<style scoped>
/* 1. declare transition */
.expand-move,
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translateY(-100%);
}

</style>