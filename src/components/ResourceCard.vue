<script lang="ts">
import { reactive, ref } from "vue";
import { TagStatus } from "@/schemas";
import type { ResourceSchema } from "@/schemas";
import { categoryChipStyles } from "@/hooks";
import { useOrganizationStore, useTagStore, useUserStore } from "@/store";
import { BIconStarFill } from "bootstrap-icons-vue";
// import { LayoutPlugin } from 'bootrap-vue';

export default {
  props: {
    resource: { type: Object as () => ResourceSchema },
  },
  components: {
    BIconStarFill,
  },
  setup(props: { resource?: ResourceSchema }) {
    const organizationStore = useOrganizationStore();
    const userStore = useUserStore();

    const tagStore = useTagStore();
    const tagArr = ref(
      props.resource && props.resource.Tags ? props.resource.Tags : [""]
    );
    const tagList = tagArr.value.reduce((x, y) => `${x}, ${y}`);

    const isFavoriteTag = reactive<{ value: boolean }>({ value: false });
    const isFilteredTag = reactive<{ value: boolean }>({ value: false });

    const currentId = props.resource ? props.resource.id : "";
    const isFavoriteResource = ref(
      userStore.favoriteResources.indexOf(currentId) !== -1
    );

    function lookForTagChange() {
      let thereIsFilter = false;
      let thereIsFavorite = false;
      tagArr.value.forEach((x) => {
        if (!tagStore.tagLookup[x]) return;
        // Handle favorite logic
        if (tagStore.tagLookup[x].status === TagStatus.favorite) {
          isFavoriteTag.value = true;
          thereIsFavorite = true;
        } else isFavoriteTag.value = false;

        // Handle filtering logic
        if (tagStore.tagLookup[x].status === TagStatus.filtered) {
          isFilteredTag.value = true;
          thereIsFilter = true;
        } else if (thereIsFilter) {
          // do nothing if the resource is already filtered
          // The app will break without this block
        } else isFilteredTag.value = false;
      });
    }

    tagStore.$subscribe(() => {
      lookForTagChange();
    });

    return {
      categoryChipStyles,
      tagList,
      tagStore,
      userStore,
      organizationStore,
      isFavoriteTag,
      isFilteredTag,
      currentId,
      isFavoriteResource,
    };
  },
};
</script>

<template>
  <div v-if="!isFilteredTag.value" :class="`card resource-card`">
    <div v-if="resource" class="card-body">
      <span style="display: flex; justify-content: flex-start">
        <bIconStarFill
          class="favorite-resource-button"
          :style="`color: ${
            userStore.favoriteResources.indexOf(currentId) !== -1
              ? 'gold'
              : 'grey'
          }`"
          @click="userStore.toggleFavoriteResource(currentId)"
        />

        <h5 class="card-title">{{ resource.Name }}</h5>
      </span>
      <!-- Provides section-->
      <p>Priority: {{ resource.priority }}</p>
      <div class="flex-container">
        <h6 class="provides-header">Provides:</h6>
        <span
          class="badge rounded-pill flex-container"
          :style="{
            backgroundColor: categoryChipStyles(resource.Provides).color,
          }"
        >
          {{ resource.Provides }}
          {{ categoryChipStyles(resource.Provides).emoji }}
        </span>
      </div>
      <!-- Tags section-->
      <div class="flex-container">
        <p>
          Tags:

          <span>{{ tagList }} </span>
        </p>
      </div>
      <p v-if="resource.Notes" class="card-text">
        {{ resource.Notes.slice(0, 200).replace(/ \w+$| $/i, "...") }}
      </p>

      <div v-if="resource['Organizations']">
        Get help from
        <router-link
          style="margin: 5px"
          v-for="org in resource['Organizations']"
          :key="org"
          :to="'/organizations/' + org"
        >
          {{ organizationStore.lookup[org].Name }}
        </router-link>
      </div>
      <router-link :to="'/resource/' + resource.id">
        <button class="btn btn-primary">More Information</button>
      </router-link>
    </div>
  </div>
</template>
<style scoped>
.flex-container {
  display: flex;
  align-items: center;
}

.provides-header {
  padding-right: 5px;
  margin-bottom: 0;
}

.favorited-tag {
  order: -1;
}

.resource-card {
  width: 100%;
  max-width: 400px;
}

.favorite-resource-button {
  cursor: pointer;
  margin-top: 3px;
  margin-right: 5px;
}
</style>
