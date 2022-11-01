<script lang="ts" setup>
import {NavBar} from "@/components";

</script>

<template>
  <div id="page"
    :style="`
      display: grid;
      grid-template-areas: 'sidebar navbar'
                            'sidebar body';
      grid-template-columns: 0px 1fr;
      grid-template-rows: 100px calc(100vh - 100px);`">
  <div id="sidebar" class="fixed top-0 z-50"></div>
  <NavBar id="navbar" />
  <div id="body">
    <router-view />
  </div>
  </div>
</template>


<style>
#page {
  display: grid;
  grid-template-areas: "sidebar navbar"
                       "sidebar body";
  grid-template-columns: 0px 1fr;
  grid-template-rows: 100px calc(100vh - 100px);
}

#sidebar {
  grid-area: sidebar;
}

#navbar {
  grid-area: navbar;
  height: fit-content;
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 40;
}

#body {
  grid-area: body;
}
</style>
