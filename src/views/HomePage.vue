<script lang="ts">
import { defineComponent } from 'vue';

import {
  useOrganizationStore, useResourceStore, useCategoryStore, useTagStore,
} from '@/store/index';

import { Provides } from '@/schemas/index';

import { onlyUnique } from '@/hooks/index';

import { CategorySelector } from '@/components/index';

export default defineComponent({
  components: {
    CategorySelector,
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
  <div class="home container">
    <h1>Welcome to Need Help Missoula</h1>
    <CategorySelector />

    <p>
      We hope to provide an accessible, easy to use portal to resources and organizations that help those in need in
      Missoula and Western Montana.
    </p>
    <h2>How it's organized</h2>
    <p>The two main pages of this site are the Organizations page, and Resources page.</p>

    <router-link class="nav-link" aria-current="page" :to="{ name: 'resources' }">
      <h3>Resources</h3>
    </router-link>

    <p>
      The <a href="/#/resources">resources page</a> a filterable database of different services,
      programs, mutual aid efforts, and more.
    </p>

    <router-link class="nav-link" aria-current="page" :to="{ name: 'organizations' }">
      <h3>Organizations</h3>
    </router-link>

    <p>
      The <a href="/#/organizations">organizations page</a> is your source for information of
      different organizations in the Missoula area, where they get their funding, who they serve,
      and how to contact them.
    </p>
  </div>
</template>
