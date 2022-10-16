<script lang="ts">
import { defineComponent } from "vue";
import MainSearchBar from "./MainSearchBar.vue";

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
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Need Help Missoula</a>

      <MainSearchBar style="max-width: 300px" />
      <!--
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">-->
      <div class="navbar-nav">
        <router-link
          class="nav-link"
          aria-current="page"
          :to="{ name: 'organizations' }"
          >Organizations</router-link
        >

        <router-link class="nav-link" :to="{ name: 'resources' }"
          >Resources</router-link
        >
        <router-link class="nav-link" :to="{ name: 'favorites' }"
          >Favorites</router-link
        >
      </div>
      <!--</div>-->
    </div>
  </nav>
</template>
