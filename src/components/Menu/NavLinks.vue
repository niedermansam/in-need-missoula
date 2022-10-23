<script lang="ts" setup>
import { useUserStore } from '@/store';

   const linkStyle = "text-base font-medium text-gray-500 px-4 py-3 sm:p-1 border-b sm:border-none w-full text-right hover:text-gray-700 hover:bg-gray-50 sm:hover:bg-white";
   const userStore = useUserStore()
</script>
<template>
    <nav 
          class="space-x-6 flex items-end">
          <MainSearchBar style="max-width: 300px" />
          <router-link
            :class="linkStyle"
            :to="{ name: 'organizations' }"
            @click="userStore.handleMenuClose()"
            >Organizations</router-link
          >

          <router-link
            :class="linkStyle"
            :to="{ name: 'resources' }"
            @click="userStore.handleMenuClose()"
            >Resources</router-link
          >
          <router-link
            :class="linkStyle"
            :to="{ name: 'favorites' }"
            @click="userStore.handleMenuClose()"
            >Favorites</router-link
          >
        </nav>
</template>

<style scoped>
.active-link {
    font-weight: 600;
}
</style>