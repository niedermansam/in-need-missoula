<template>
  <NavBar />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "./components/Menu/NavBar.vue";

export default defineComponent({
  components: {
    NavBar,
  },
});
</script>

<style lang="scss"></style>
