<script lang="ts">
import { defineComponent } from "vue";
import {
  useOrganizationStore,
  useResourceStore,
  useCategoryStore,
} from "../store/index";
import { CategorySelector, OrganizationCard, PageHeader } from "../components";

export default defineComponent({
  components: {
    OrganizationCard,
    CategorySelector,
    PageHeader,
  },
  setup() {
    const catStore = useCategoryStore();
    const orgStore = useOrganizationStore();
    const resourceStore = useResourceStore();

    async function loadAllData() {
      await orgStore.loadData();
      await resourceStore.loadData();
    }
    loadAllData();

    const filterRegEx = catStore.getFilter;
    return { orgStore, catStore, filterRegEx };
  },
});
</script>
<template>
  <div class="organizations">
    <PageHeader>Organizations</PageHeader>
    <CategorySelector />
    <div>
      <h3 v-if="orgStore.loading">Loading...</h3>
      <h3 v-if="!orgStore.loading && orgStore.error">{{ orgStore.error }}</h3>
      <div v-if="orgStore.arr != null">
        <div>
          <OrganizationCard
            v-for="organization in orgStore.arr.filter((x) => {
              return !catStore.isFiltered(x.Expertise);
            })"
            :key="organization.id"
            :organization="organization"
          />
        </div>
      </div>
    </div>
  </div>
</template>
