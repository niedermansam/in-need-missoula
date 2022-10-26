<script lang="ts" setup>
import { Transition } from "vue";
import {RouterLink} from "vue-router";
// import MainSearchBar from "@/components/MainSearchBar.vue";
import { NavLinks } from "@/components";
import { BIconList } from "bootstrap-icons-vue";
import { useUserStore } from "@/store";

const userStore = useUserStore()
</script>

<template>
  <div class="nav-section" style="grid-area: header">
    <div class="nav-container">
      <div
        class="link-container"
      >
        <div class="logo-container">
          <a href="#">
            <img class="logo-img" src="@/assets/logo.png" alt="" />
          </a>
          <RouterLink to="/" class="need-help-msla">Need Help Missoula</RouterLink>
        </div>
        <div class="flex items-center">
        <button 
          class="mobile-menu-toggle"
          @click="userStore.handleMenuToggle()">
          <BIconList class="mobile-menu-icon" />
        </button>
        <NavLinks 
          class="hidden sm:block"/>
      </div>
    </div>
  </div>
        <Transition name="expand">
        <NavLinks 
          class="mobile-menu"
          v-if="userStore.menuOpen"/>
        </Transition>
  </div>
</template>

<style scoped>

.nav-container {
  @apply mx-auto max-w-7xl px-4 sm:px-6; }

.nav-section {
  @apply relative bg-white; }

.link-container {
  @apply flex items-center justify-between border-b-2 border-gray-100 py-6 md:space-x-10; }

.logo-container {
  @apply flex justify-start lg:w-0 lg:flex-1; }

.logo-img {
  @apply h-8 w-auto sm:h-10; }

.mobile-menu-toggle {
  @apply p-2 hover:bg-gray-100 border rounded block sm:hidden; }

.mobile-menu-icon {
  @apply text-2xl text-gray-600; }
  
.mobile-menu {
  @apply flex flex-col mr-5 fixed right-0 bg-white sm:hidden rounded-b-lg border; }

.need-help-msla {
  @apply self-center text-xl mx-2;
}
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