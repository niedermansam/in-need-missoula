<script lang="ts">
import { defineComponent } from "vue";

import {
  useOrganizationStore,
  useResourceStore,
  useCategoryStore,
  useTagStore,
} from "../store/index";

import type { Provides } from "../schemas/index";

import { onlyUnique } from "../hooks/index";

import { CategorySelector, PageHeader } from "../components";

export default defineComponent({
  components: {
    CategorySelector,
    PageHeader
},
  setup() {
    const resourceStore = useResourceStore();
    const orgStore = useOrganizationStore();

    async function loadAllData() {
      await resourceStore.loadData();
      await orgStore.loadData();
    }
    loadAllData();

    const categoryFilters = useCategoryStore();

    const tagStore = useTagStore();

    const providesArr = resourceStore.arr
      ?.map((x): Provides => x.Provides)
      .filter(onlyUnique)
      .sort((a: any, b: any) => a - b);

    return {
      orgStore,
      providesArr,
      categoryFilters,
      resourceStore,
      tagStore,
    };
  },
});
</script>

<template>
  <div class="home container p-2 w-full">
    <PageHeader>Welcome to Need Help Missoula</PageHeader>

    <p class="p-2">
      
    </p>
    <CategorySelector />

    <p class="p-2">
      We hope to provide an accessible, easy to use portal to resources and
      organizations that help those in need in Missoula and Western Montana.
    </p>
    <h2 class="p-2 text-2xl">How it's organized</h2>
    <p class="p-2">
      The two main pages of this site are the Organizations page, and Resources
      page.
    </p>

    <router-link
      class="nav-link"
      aria-current="page"
      :to="{ name: 'resources' }"
    >
      <h3 class="p-2 text-2xl text-zinc-500 hover:text-blue-500">Resources</h3>
    </router-link>

    <p class="p-2">
      The
      <a href="/#/resources" class="text-zinc-500 hover:text-blue-500">
        resources page</a
      >
      a filterable database of different services, programs, mutual aid efforts,
      and more.
    </p>

    <router-link
      class="nav-link"
      aria-current="page"
      :to="{ name: 'organizations' }"
    >
      <h3 class="p-2 text-2xl text-zinc-500 hover:text-blue-500">
        Organizations
      </h3>
    </router-link>

    <p class="p-2">
      The
      <a href="/#/organizations" class="text-zinc-500 hover:text-blue-500"
        >organizations page</a
      >
      is your source for information of different organizations in the Missoula
      area, where they get their funding, who they serve, and how to contact
      them.
    </p>
  </div>
</template>
