<script lang="ts" setup>
    const linkStyle = "text-base font-medium text-gray-500 px-4 py-3 border-b w-full text-right hover:text-gray-700 hover:bg-gray-50";
</script>
<template>
    <nav 
          class="space-x-6 flex items-end">
          <MainSearchBar style="max-width: 300px" />
          <router-link
            :class="linkStyle"
            aria-current="page"
            :to="{ name: 'organizations' }"
            >Organizations</router-link
          >

          <router-link
            :class="linkStyle"
            :to="{ name: 'resources' }"
            >Resources</router-link
          >
          <router-link
            :class="linkStyle"
            :to="{ name: 'favorites' }"
            >Favorites</router-link
          >
        </nav>
</template>