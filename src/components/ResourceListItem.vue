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
  <div v-if="!isFilteredTag.value" class="list-item-container w-full mx-4 shadow-md flex">
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
    <div v-if="resource" class="w-full flex items-center flex-wrap">
          <router-link :to="'/resources/' + resource.id" class="resource-name">
            <h5 class="text-lg text-slate-700 hover:text-slate-500 w-64">
              {{ resource.Name }}
            </h5>
          </router-link>
          <div class="flex w-1/6 min-w-fit">
          <span class="provides-emoji mr-2">
            {{ categoryChipStyles(resource.Provides).emoji }}</span>
          <span class="administering-org link-text w-56">
            <router-link
              v-if="administeringOrg"
              :to="`/organizations/${administeringOrg.id}`"
            >
              {{ administeringOrg.Name }}
            </router-link>
          </span>
      </div>
      <div class="tag-container">
        <p class="tags-header">Tags:</p>
        <div class="">
          <TagLinks :tagArr="tagArr" class="text-sm"/>
        </div>
      </div>

      <!-- Provides section-->
      <!-- <p>Priority: {{ resource.priority }}</p> -->
      <!-- Tags section-->

    </div>

      <span class="ml-auto flex w-48 self-center py-1" v-if="resource">
      <router-link
        :to="'/resources/' + resource.id"
        class="more-info-link"
      >
        <button class="btn-link-lg">More Information</button>
      </router-link>
      </span>
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
  @apply flex px-2 items-stretch lg:w-1/2;
}

.tags-header {
  @apply self-center mr-2;
}

.card-text {
  @apply my-3 px-2;
}

.help-from-container {
  @apply mb-3 px-2;
}

.more-info-link {
  @apply  m-1;
}
.flex-container {
  display: flex;
  align-items: center;
}

.provides-header {
  padding-right: 5px;
  margin-bottom: 0;
}

</style>
