<script lang="ts">
import { reactive, ref } from 'vue';
import { ResourceSchema, TagStatus } from '@/schemas';
import { categoryChipStyles } from '@/hooks';
import { useOrganizationStore, useTagStore } from '@/store';
// import { LayoutPlugin } from 'bootrap-vue';

export default {
  props: {
    resource: { type: Object as () => ResourceSchema },
  },
  setup(props:{resource?:ResourceSchema}) {
    const organizationStore = useOrganizationStore();

    const tagStore = useTagStore();
    const tagArr = ref(props.resource && props.resource.Tags ? props.resource.Tags : ['']);
    const tagList = tagArr.value.reduce((x, y) => `${x}, ${y}`);

    const isFavorite = reactive<{value: boolean}>({ value: false });
    const isFiltered = reactive<{value: boolean}>({ value: false });

    function lookForTagChange() {
      let thereIsFilter = false;
      let thereIsFavorite = false;
      tagArr.value.forEach((x) => {
        if (!tagStore.tagLookup[x]) return;
        // Handle favorite logic
        if (tagStore.tagLookup[x].status === TagStatus.favorite) {
          isFavorite.value = true;
          thereIsFavorite = true;
        } else isFavorite.value = false;

        // Handle filtering logic
        if (tagStore.tagLookup[x].status === TagStatus.filtered) {
          isFiltered.value = true;
          thereIsFilter = true;
        } else if (thereIsFilter) {
          // do nothing if the resource is already filtered
          // The app will break without this block
        } else isFiltered.value = false;
      });
    }

    tagStore.$subscribe(() => {
      lookForTagChange();
    });

    return {
      categoryChipStyles, tagList, tagStore, organizationStore, isFavorite, isFiltered,
    };
  },
};
</script>

<template>
  <div v-if="!isFiltered.value" :class="`card resource-card`">
    <div v-if="resource" class="card-body">
      <h5 class="card-title">{{ resource.Name }}</h5>
      <!-- Provides section-->
        <p>Priority: {{ resource.priority }}</p>
      <div class="flex-container">
        <h6 class="provides-header">Provides:</h6>
        <span
          class="badge rounded-pill flex-container"
          :style="{ backgroundColor: categoryChipStyles(resource.Provides).color }"
        >
          {{ resource.Provides }} {{ categoryChipStyles(resource.Provides).emoji }}
        </span>
      </div>
      <!-- Tags section-->
      <div class="flex-container">
        <p>Tags:

        <span >{{ tagList }} </span>
        </p>
      </div>
      <p v-if="resource.Notes" class="card-text">
        {{ resource.
            Notes.
            slice(0, 200).
            replace(/ \w+$| $/i, "...") }}
      </p>

      <div v-if="resource['Organizations']">
        Get help from
         <router-link style='margin: 5px;'
         v-for="org in resource['Organizations']"
         :key="org"
         :to="'/organizations/' + org">
          {{organizationStore.lookup[org].Name}}
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
  width: 45vw;
}

</style>
