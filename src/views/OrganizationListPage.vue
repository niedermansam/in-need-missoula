<script lang="ts">
import { defineComponent} from "vue";
import {
  useOrganizationStore,
  useResourceStore,
  useCategoryStore,
} from "@/store";
import { CategorySelector, OrganizationCard, PageHeader } from "@/components";
import DataError from "../components/DataError.vue";
import { BIconArrowUp } from "bootstrap-icons-vue";
import SelectCategoryNotification from "../components/SelectCategoryNotification.vue";

export default defineComponent({
  components: {
    OrganizationCard,
    CategorySelector,
    PageHeader,
    DataError,
    BIconArrowUp,
    SelectCategoryNotification
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
      <DataError v-if="!orgStore.loading && orgStore.error && !orgStore.loaded" class="text-center" />
      <div v-if="orgStore.arr != null">
        <TransitionGroup
          tag="div"
          name="fade"
          class="card-group">
          <OrganizationCard
            v-for="organization in orgStore.getActive"
            :key="organization.id"
            :organization="organization"
          />
        </TransitionGroup>
      </div>
      <SelectCategoryNotification :show="'organizations'"
        v-if="!orgStore.loading && orgStore.getActive !== undefined && orgStore.getActive.length === 0" />
    </div>
  </div>
</template>
