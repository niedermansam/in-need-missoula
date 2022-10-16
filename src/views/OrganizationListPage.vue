<template>
  <div class="organizations">
    <h1>Organizations</h1>
    <CategorySelector />
    <div>
      <h3 v-if="orgStore.loading">Loading...</h3>
      <h3 v-if='!orgStore.loading && orgStore.error'>{{orgStore.error}}</h3>
      <div v-if="orgStore.arr != null">
        <div >
          <OrganizationCard
            v-for="(organization) in orgStore.arr.filter((x) => {
              return !categoryStore.isFiltered(x.Expertise)
            })"
            :key="organization.id"
            :organization="organization"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useOrganizationStore, useResourceStore, useCategoryStore } from '../store';
import { CategorySelector, OrganizationCard } from '../components';

export default defineComponent({
  components: {
    OrganizationCard,
    CategorySelector,
  },
  setup() {
    const orgStore = useOrganizationStore();
    const resourceStore = useResourceStore();
    const categoryStore = useCategoryStore();

    async function loadAllData() {
      await orgStore.loadData();
      await resourceStore.loadData();
    }
    loadAllData();

    const filterRegEx = categoryStore.getFilter;
    return { orgStore, filterRegEx, categoryStore };
  },
});
</script>
