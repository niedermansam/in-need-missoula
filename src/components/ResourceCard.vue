<script lang="ts">
import { reactive, ref } from "vue";
import { TagStatus, type ResourceSchema } from "@/schemas";
import { categoryChipStyles } from "@/hooks";
import { useOrganizationStore, useTagStore, useUserStore } from "@/store";
import { BIconStarFill } from "bootstrap-icons-vue";
import TagLinks from "./Tags/TagLinks.vue";
// import { LayoutPlugin } from 'bootrap-vue';

export default {
  props: {
    resource: { type: Object as () => ResourceSchema },
  },
  components: {
    BIconStarFill,
    TagLinks,
  },
  setup(props: { resource?: ResourceSchema }) {
    const organizationStore = useOrganizationStore();
    const userStore = useUserStore();

    const tagStore = useTagStore();
    const tagArr = ref(
      props.resource && props.resource.Tags ? props.resource.Tags : [""]
    );

    const isFavoriteTag = reactive<{ value: boolean }>({ value: false });
    const isFilteredTag = reactive<{ value: boolean }>({ value: false });

    const currentId = props.resource ? props.resource.id : "";
    const isFavoriteResource = ref(
      userStore.favoriteResources.indexOf(currentId) !== -1
    );

    function lookForTagChange() {
      let thereIsFilter = false;
      tagArr.value.forEach((x) => {
        if (!tagStore.tagLookup[x]) return;
        // Handle favorite logic
        if (tagStore.tagLookup[x].status === TagStatus.favorite) {
          isFavoriteTag.value = true;
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
      tagArr,
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
  <div v-if="!isFilteredTag.value" class="w-full m-3 md:w-2/5 lg:w-1/3">
    <div v-if="resource" class="border p-3 m-3 rounded h-auto w-full flex flex-col">
      <span class="flex items-stretch mb-2">
        <button
          @click="userStore.toggleFavoriteResource(currentId)"
          class="w-8">
        <bIconStarFill
          class="my-0 mr-1 p-1 w-6 h-6"
          :style="`color: ${
            userStore.favoriteResources.indexOf(currentId) !== -1
              ? 'gold'
              : 'grey'
          }`"
        />
        </button>
      <router-link :to="'/resources/' + resource.id" class="mt-auto mb-0 hover:text-slate-600">
        <h5 class="text-lg">
          {{ resource.Name }}
        </h5>
      </router-link>
        <div class="ml-1 text-gray-500 flex">
          {{ categoryChipStyles(resource.Provides).emoji }}
          {{ resource.Provides }}
        </div>
      </span>
      <!-- Provides section-->
      <!-- <p>Priority: {{ resource.priority }}</p> -->
      <!-- Tags section-->
      <div class="flex">
        <p class="my-1 py-1 mr-2">Tags:</p>
        <div>
          <TagLinks :tagArr="tagArr" />
        </div>
      </div>
      <p v-if="resource.Notes" class="card-text mb-3">
        {{ resource.Notes.slice(0, 200).replace(/ \w+$| $/i, "...") }}
      </p>

      <div
        v-if="organizationStore.loaded && resource['Organizations']"
        class="mb-3"
      >
        Get help from
        <router-link
          v-for="org in resource['Organizations']"
          :key="org"
          :to="'/organizations/' + org"
        >
          {{ organizationStore.lookup[org].Name }}
        </router-link>
      </div>
      <router-link :to="'/resources/' + resource.id" class="mt-auto mb-0">
        <button class="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white">
          More Information
        </button>
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

.tag-link {
  padding: 0;
  margin: 0px 5px 0px 5px;
  width: max-content;
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
