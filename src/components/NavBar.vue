<script lang="ts">
import { defineComponent } from "vue";
import MainSearchBar from "@/components/MainSearchBar.vue";

export default defineComponent({
  components: { MainSearchBar },
  setup() {
    // Thank god for stack overflow
    //  https://stackoverflow.com/questions/55233713/match-sub-string-within-a-string-with-tolerance-of-1-character-mismatch-in-js
    const txtToSearch = "dog";
    function useLooseSearch(inputText: string, textToSearch: string) {
      // generate regex for all possibilities. for this case, it will generate "d?.?og|do?.?g|dog?.?" -> double .? are for 1 char insertion
      const re = new RegExp(
        inputText
          .split("")
          .map(
            (a, b, c) =>
              `${inputText.substr(0, b) + a}?.?${inputText.substr(b + 1)}`
          )
          .join("|"),
        "gi"
      );
      return textToSearch.match(re) != null;
    }
  },
});
</script>

<template>
<div class="relative bg-white" style="grid-area: header;">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div class="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
      <div class="flex justify-start lg:w-0 lg:flex-1">
        <a href="#">
          <img class="h-8 w-auto sm:h-10" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="">
        </a>
        <a class="self-center text-xl mx-2" href="#">Need Help Missoula</a>
      </div>
      <nav class="space-x-6 md:flex items-center">
      <MainSearchBar class="" style="max-width: 300px" />

        <router-link
          class="text-base font-medium text-gray-500 hover:text-gray-900"
          aria-current="page"
          :to="{ name: 'organizations' }"
          >Organizations</router-link
        >

        <router-link class="text-base font-medium text-gray-500 hover:text-gray-900" :to="{ name: 'resources' }"
          >Resources</router-link
        >
        <router-link class="text-base font-medium text-gray-500 hover:text-gray-900" :to="{ name: 'favorites' }"
          >Favorites</router-link
        >

      </nav>
    </div>
  </div>

</div>
</template>
