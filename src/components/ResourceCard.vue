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

    const administeringOrg =
      props.resource && props.resource["Administering Org"]
        ? organizationStore.lookup[props.resource["Administering Org"][0]]
        : null;

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
      administeringOrg,
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
  <div v-if="!isFilteredTag.value" class="card-container">
    <div v-if="resource" class="card-body">
      <div class="card-header">
        <div class="resource-name-container">
          <button
            @click="userStore.toggleFavoriteResource(currentId)"
            class="favorite-toggle toggle-width"
            :class="
              userStore.favoriteResources.indexOf(currentId) !== -1
                ? 'is-favorite'
                : ''
            "
          >
            <bIconStarFill
              class="star-icon mr-0 drop-shadow"
              :class="
                userStore.favoriteResources.indexOf(currentId) !== -1 ? '' : ''
              "
            />
          </button>
          <router-link :to="'/resources/' + resource.id" class="resource-name">
            <h5 class="text-lg text-slate-700 hover:text-slate-500">
              {{ resource.Name }}
            </h5>
          </router-link>
        </div>
        <div class="card-content">
          <span class="administering-org link-text">
            <router-link
              v-if="administeringOrg"
              :to="`/organizations/${administeringOrg.id}`"
            >
              {{ administeringOrg.Name }}
            </router-link>
          </span>
          <span class="provides-emoji">
            {{ categoryChipStyles(resource.Provides).emoji }}</span
          >
          <span class="resource-provides">
            {{ resource.Provides }}
          </span>
        </div>
      </div>

      <!-- Provides section-->
      <!-- <p>Priority: {{ resource.priority }}</p> -->
      <!-- Tags section-->
      <div class="tag-container">
        <p class="tags-header">Tags:</p>
        <div>
          <TagLinks :tagArr="tagArr" />
        </div>
      </div>
      <p v-if="resource.Notes" class="card-text">
        {{ resource.Notes.slice(0, 200).replace(/ \w+$| $/i, "...") }}
      </p>

      <div
        v-if="organizationStore.loaded && resource['Organizations']"
        class="help-from-container"
      >
        <p>Get help from:</p>

        <router-link
          v-for="(org, index) in resource['Organizations']"
          class="mr-1 link-text"
          :key="org"
          :to="'/organizations/' + org"
        >
          {{ organizationStore.lookup[org].Name
          }}{{ index === resource.Organizations.length - 1 ? "" : "," }}
        </router-link>
      </div>
      <router-link
        :to="'/resources/' + resource.id"
        class="more-info-link"
      >
        <button class="btn-link-lg">More Information</button>
      </router-link>
    </div>
  </div>
</template>
<style scoped>



.resource-name-container {
  @apply flex items-stretch;
}

.toggle-width {
  @apply w-10;
}

.favorite-toggle {
  @apply p-1 rounded-tl rounded-br flex justify-center items-center bg-slate-100 text-slate-400 hover:bg-yellow-300;
}

.is-favorite {
  @apply text-white bg-yellow-400 hover:bg-slate-200 hover:text-yellow-400;
}

.star-icon {
  @apply my-0 p-1 w-6 h-6;
}

.resource-name {
  @apply p-2 font-semibold text-slate-700 hover:text-slate-600;
}

.card-content {
  @apply flex px-1 pb-2;
}

.administering-org {
  @apply px-1 font-semibold;
}

.resource-provides {
  @apply ml-1 text-slate-500 flex;
}

.tag-container {
  @apply flex px-2;
}

.tags-header {
  @apply my-1 py-1 mr-2;
}

.card-text {
  @apply my-3 px-2;
}

.help-from-container {
  @apply mb-3 px-2;
}

.more-info-link {
  @apply  mt-auto mb-0 px-2 pb-3 pt-4;
}
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
