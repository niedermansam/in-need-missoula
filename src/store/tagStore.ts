import{ onlyUnique } from "@/hooks";
import { TagStatus, TagPriority, type TagArray, type TagLookupInterface } from "@/schemas";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useCategoryStore, useResourceStore, useUserStore } from '@/store'; // eslint-disable-line

enum SpliceUtils { // eslint-disable-line
  deleteNone = 0,
  insertAfer = 1,
  removeOne = 1,
}
enum SortUtils { // eslint-disable-line
  before = 1,
  after = -1,
}
enum IndexUtils { // eslint-disable-line
  doesntexist = -1,
}
const useTagStore = defineStore("tagStore", () => {
  // * General Properties
  // Bring in data for orgs and resources
  const categoryStore = useCategoryStore();
  const resourceStore = useResourceStore();
  const userStore = useUserStore();
  const allTags = ref<string[]>([""]);

  /** Create a look table for all tags
   * @property {object} tag - All tag names
   * @property {TagStatus} tag.status - Status of the current tag {@link TagStatus}.
   * @property {TagPriority} tag.priority - Priority of the current tag {@link TagPriority}
   * @details Creates a ref object tag names representing keys.
   */
  const tagLookup = ref<{ [key: string]: TagLookupInterface }>({});

  /** Object where the key is a category (e.g. Provides, Expertise), and the value is an array of tags that appear in that category. */
  const tagCategoryKey = ref<{ [key: string]: TagArray }>({});

  /** loadAllTags does 3 things:
  1. create allTags array
       Create an array of all (unique) tag names
       and stores it in the variable allTags
  2. Create tagLookup Object
      Create an object with tag names for keys,
      and more information about the user's interaction
      with that tag (favorite, filter, etc.)
  3. Initialize the activeCategoryTags Array
       This array keeps track of tags that are associated
       with currently active categories, so unnecessary tags
       aren't shown. */
  async function loadAllTags() {
    await resourceStore.loadData();
    //* Create an array of all tags
    const tagArr = resourceStore.arr?.reduce(
      (outputArr: string[], currentResource) => {
        // Make a lookup table where the key is a Category, and the value is an array of tags
        // ? Should I do this somewhere else?
        if (!currentResource.Tags) return [""];
        if (!tagCategoryKey.value) return [""];
        const catExists = tagCategoryKey.value[currentResource.Provides];

        // If it doesn't, create it
        if (!catExists && currentResource && currentResource.Tags)
          tagCategoryKey.value[currentResource.Provides] = [
            ...currentResource.Tags,
          ];
        // if it does, add the current items to the array
        else if (currentResource && currentResource.Tags)
          tagCategoryKey.value[currentResource.Provides].push(
            ...currentResource.Tags
          );
        // For each tag in the current resource
        currentResource.Tags.forEach((x) => {
          // add tag to tag lookup table
          if (!tagLookup.value[x]) {
            // if tag record doesn't exist, create it
            tagLookup.value[x] = {
              categories: [currentResource.Provides],
              status: TagStatus.none,
              priority: TagPriority.none,
            };
          } else {
            // if it does exist, update it
            tagLookup.value[x].categories = [
              currentResource.Provides,
              ...tagLookup.value[x].categories,
            ];
          }
          // finish if the tag in already in the all tags
          if (outputArr.indexOf(x) !== -1) return;
          // put any new tags in output array
          outputArr.push(x);
        });
        return outputArr || [""];
      },
      [] as string[]
    ); //! end loop making tag array
    // ? Filter duplicated out of the tag-category lookup table
    Object.keys(tagCategoryKey.value).forEach((category) => {
      tagCategoryKey.value[category] =
        tagCategoryKey.value[category].filter(onlyUnique);
    });
    // console.log('tag Lookup: ', tagLookup.value);
    if (!tagArr) return;
    allTags.value = tagArr as string[];
  } // end of loadAllTags

  /** Array of tags the user has filtered.
   * @see {@link addFilter} Adds element to array, changes status & priority.
   * @see {@link removeFromFilterArray} Removes element from array.
   * @see {@link removeFilter} Changes priority & status, calls {@link removeFromFilterArray}.
   * @see {@link isFiltered} Returns true if user is less interested in tag, false if not.
   */
  const filters = ref([""]);

  /** Remove selected tag from {@link filters}
   * @param  {string} tag Tag to be removed.
   * @see {@link removeFilter} Changes priority & status, and calls {@link removeFromFilterArray}.
   */
  function removeFromFilterArray(tag: string) {
    const index = filters.value.indexOf(tag);
    if (index === IndexUtils.doesntexist) return; // end if tag isn't in filters
    filters.value.splice(index, 1);
  }

  /** Array of tags the user has favorited.
   * @see {@link addFavorite} Adds element to array, changes status & priority.
   * @see {@link removeFromFavoriteArray} Removes element from array.
   * @see {@link removeFavorite} Changes priority & status, calls removeFromFavoriteArray()
   * @see {@link isFavorite} Returns true if user is less interested in tag, false if not.
   */
  const favorites = ref([""]);

  /** Remove selected tag from {@link favorites}
   * @param  {string} tag Tag to be removed.
   * @see {@link removeFavorite} Changes priority & status, calls {@link removeFromFavoriteArray}.
   */
  function removeFromFavoriteArray(tag: string) {
    const index = favorites.value.indexOf(tag);
    if (index === IndexUtils.doesntexist) return; // end if tag isn't in favorites
    favorites.value.splice(index, 1);
    resourceStore.updateAllPriorities();
  }

  /** Array of tags the user is "less interested" in.
   * @see {@link addLessInterested} Adds element to array, changes status & priority.
   * @see {@link removeFromLessInterestedArray} Removes element from array.
   * @see {@link removeLessInterested} Changes priority & status, and calls {@link removeFromLessInterestedArray}
   * @see {@link isLessInterested} Returns true if user is less interested in tag, false if not.
   */
  const lessInterested = ref([""]);

  /** Remove selected tag from {@link lessInterested}
   * @param  {string} tag Tag to be removed.
   * @see {@link removeLessInterested} Changes priority & status, and calls {@link removeFromLessInterestedArray}.
   */
  function removeFromLessInterestedArray(tag: string) {
    const index = lessInterested.value.indexOf(tag);
    if (index === IndexUtils.doesntexist) return; // end if tag isn't in favorites
    lessInterested.value.splice(index, 1);
    resourceStore.updateAllPriorities();
  }

  /**  List of tags associated with active categories */
  const activeCategoryTags = ref<string[]>([""]);

  /**
   * Handles UI for the tag selectors.
   * @param  {string} tag tag name to be changed
   * @param  {TagPriority} oldPriority old priority of the tag
   * @param  {TagPriority} newPriority new priority of the tag
   * @details Removes tag from array, calculates where to re-insert it based on
   * previous and current tag priority.
   */
  function arrangeByPriority(
    tag: string,
    oldPriority: TagPriority,
    newPriority: TagPriority
  ) {
    if (userStore.tagSettings.sortTags === false) return;
    // remove current tag from array
    const shuffleTagIndex = activeCategoryTags.value.indexOf(tag);
    activeCategoryTags.value.splice(shuffleTagIndex, SpliceUtils.removeOne);

    const priorityArray = activeCategoryTags.value.map(
      (currentTag: string) => tagLookup.value[currentTag].priority,
      []
    );

    if (newPriority === TagPriority.lessInterested) {
      const indexOfLessInterested = priorityArray.indexOf(
        TagPriority.lessInterested
      );
      const indexOfFirstFiltered = priorityArray.indexOf(TagPriority.filtered);
      let insertIndex = priorityArray.length;

      if (indexOfLessInterested !== IndexUtils.doesntexist)
        insertIndex = indexOfLessInterested;
      else if (indexOfFirstFiltered !== IndexUtils.doesntexist)
        insertIndex = indexOfFirstFiltered;

      activeCategoryTags.value.splice(insertIndex, SpliceUtils.deleteNone, tag);
      // end less interested
    } else if (newPriority === TagPriority.filtered) {
      const indexOfFirstFiltered = priorityArray.indexOf(TagPriority.filtered);
      const insertIndex =
        indexOfFirstFiltered > IndexUtils.doesntexist
          ? indexOfFirstFiltered
          : priorityArray.length;
      activeCategoryTags.value.splice(insertIndex, SpliceUtils.deleteNone, tag);
      // end filtered
    } else if (newPriority === TagPriority.favorite) {
      const indexOfLastFavorite =
        priorityArray.lastIndexOf(TagPriority.favorite) +
        SpliceUtils.insertAfer;
      if (indexOfLastFavorite === IndexUtils.doesntexist)
        activeCategoryTags.value.unshift(tag);
      else
        activeCategoryTags.value.splice(
          indexOfLastFavorite,
          SpliceUtils.deleteNone,
          tag
        );
      // end favorite
    } else if (newPriority === TagPriority.none) {
      const firstNoPriorityIndex = priorityArray.indexOf(TagPriority.none);
      const lastNoPriorityIndex = priorityArray.lastIndexOf(TagPriority.none);

      if (oldPriority === TagPriority.favorite) {
        activeCategoryTags.value.splice(
          firstNoPriorityIndex,
          SpliceUtils.deleteNone,
          tag
        );
      } else {
        activeCategoryTags.value.splice(
          lastNoPriorityIndex + SpliceUtils.insertAfer,
          SpliceUtils.deleteNone,
          tag
        );
      }
      // end no priority
    } else {
      activeCategoryTags.value.push(tag);
    }
  }

  // * Get tags of active categories
  /** Sorts two tags.
   * @param  {string} tagA First tag to be compared.
   * @param  {string} tagB Second tag to be compared.
   * @details Tags are first sorted by priority, then alphabetically.
   */
  const sortTags = (tagA: string, tagB: string) => {
    const aPriori = tagLookup.value[tagA].priority;
    const bPriori = tagLookup.value[tagB].priority;

    if (aPriori > bPriori) return SortUtils.after;
    if (aPriori < bPriori) return SortUtils.before;

    return tagA.localeCompare(tagB);
  };

  /** Filter out tags that are no in active categories, and sort remaining tags based on priority.
   * @see {@link categoryStore.filters} for source of {@link activeFilters}.
   * @see {@link onlyUnique} is used to filter duplicated tags.
   * @see {@link sortTags} is used to sort {@link activeCategoryTags} by priority, and then alphabetically.
   */
  async function updateTagDisplay() {
    if (!allTags.value[0]) await loadAllTags(); // get tags if they don't exist

    const activeFilters = categoryStore.filters; // get active category filters

    // object with filtered tags removed
    let activeTags = Object.entries(tagCategoryKey.value) // get all tags that appear in active categories
      .filter((keyValueArray) => {
        // filter out any tags that do not appear in active categories
        const currentTagKey = keyValueArray[0];
        return activeFilters.indexOf(currentTagKey) === IndexUtils.doesntexist;
      })
      .flatMap((remainingKeyValues) => {
        // return an array of the remaining tags
        const tagValues = remainingKeyValues[1];
        return tagValues;
      })
      .filter(onlyUnique); // This looked pretty when it was all on one line, but I had no idea what was going on

    if (!activeTags) activeTags = ["No Active Categories :("];
    activeCategoryTags.value = activeTags.sort(sortTags); // sort tags & update the state of this store
  } // end updateTagDisplay()

  /** Get a regular expression of all the current filters
   * @return /filter1|filter2|filter3|etc/
   */
  function getFilterRegex() {
    const currentFilters = [...filters.value];
    if (currentFilters.indexOf("") !== IndexUtils.doesntexist)
      currentFilters.splice(currentFilters.indexOf(""), 1);
    return new RegExp(currentFilters.join("|").replace("^\\|", ""));
  } //* returns /filter1|filter2|filter3|etc/

  /** Resets the priority of specifified tag.
   * @param  {string} tag
   * @details Sets tag priority to {@link TagPriority.none}, and status to {@link TagStatus.none}.
   * Removes the tag from the {@link filters}, {@link favorites}, and {@link lessInterested} arrays.
   */
  function resetPriority(tag: string) {
    const priorityBefore = Number(tagLookup.value[tag].priority) as TagPriority;

    tagLookup.value[tag].status = TagStatus.none;
    tagLookup.value[tag].priority = TagPriority.none;

    removeFromFavoriteArray(tag);
    removeFromFilterArray(tag);
    removeFromLessInterestedArray(tag);

    arrangeByPriority(tag, priorityBefore, TagPriority.none);
    resourceStore.updateAllPriorities();
  }

  /** Resets the priority of all tags to 'none'.
   * @details Removes the tag from the {@link filters}, {@link favorites}, and {@link lessInterested} arrays.
   * Updates display order of resources with {@link resourceStore.updateAllPriorities},
   * and updates the order of the displayed tags withs {@link updateTagDisplay}. */
  function resetPriorityAll() {
    Object.keys(tagLookup.value).forEach((tag) => {
      resetPriority(tag);
    });
    resourceStore.updateAllPriorities();
    updateTagDisplay();
  }

  /** Upates tag with new priority and status.
   * @param  {string} tag Name of the tag to be changed
   * @param  {TagPriority} newPriority Tag's new Priority
   * @see {@link updateTagDisplay} sorts the tag list dipsplayed to user.
   * @see {@link resourceStore.updateAllPriorities} calculates the priority for each resource, which typically have multiple tags.
   */
  function handlePriorityChange(tag: string, newPriority: TagPriority) {
    switch (newPriority) {
      case TagPriority.favorite:
        tagLookup.value[tag].status = TagStatus.favorite;
        break;
      case TagPriority.none:
        tagLookup.value[tag].status = TagStatus.none;
        break;
      case TagPriority.lessInterested:
        tagLookup.value[tag].status = TagStatus.lessInterested;
        break;
      case TagPriority.filtered:
        tagLookup.value[tag].status = TagStatus.filtered;
        break;
      default:
        console.error("Default case in tagStore.priorityToStatus() triggered.");
        tagLookup.value[tag].status = TagStatus.none;
        tagLookup.value[tag].priority = TagPriority.none;
    } // end switch statement
  }

  /** Move priority up one
   * @param  {string} tag Tag to bump
   * @description Moves priority up one (filtered -> lessInterested -> none -> favorite)
   */
  function bumpPriority(tag: string) {
    const priorityBefore = Number(tagLookup.value[tag].priority) as TagPriority;
    let priorityAfter = priorityBefore + 1;
    if (priorityAfter > TagPriority.favorite)
      priorityAfter = TagPriority.favorite;

    tagLookup.value[tag].priority = priorityAfter;

    handlePriorityChange(tag, priorityAfter);

    arrangeByPriority(tag, priorityBefore, priorityAfter);
  } // end bumpPriority()

  /** Move priority down one
   * @param  {string} tag Tag to bump
   * @description Moves priority down one (favorite -> none -> lessInterested -> filtered)
   */
  function dropPriority(tag: string) {
    const priorityBefore = Number(tagLookup.value[tag].priority) as TagPriority;
    let priorityAfter = priorityBefore - 1;
    if (priorityAfter < TagPriority.filtered)
      priorityAfter = TagPriority.filtered;

    tagLookup.value[tag].priority = priorityAfter;

    handlePriorityChange(tag, priorityAfter);

    arrangeByPriority(tag, priorityBefore, priorityAfter);
  } // end bumpPriority()

  /** 'Favorite' the selected tag.
   * @param  {string} tag Tag to favorite.
   * @description Adds tag to {@link favorites} and changes tag status to {@link TagStatus.favorite} and tag priority to {@link TagPriority.favorite}.
   * Removes tag from {@link filter} and {@link lessInterested} arrays.
   * Updates order of resources using {@link resourceStore.updateAllPriorities}
   */
  function addFavorite(tag: string) {
    const priorityBefore = Number(tagLookup.value[tag].priority) as TagPriority;
    tagLookup.value[tag].status = TagStatus.favorite;
    tagLookup.value[tag].priority = TagPriority.favorite;

    removeFromFilterArray(tag);
    removeFromLessInterestedArray(tag);

    arrangeByPriority(tag, priorityBefore, TagPriority.favorite);

    if (resourceStore.arr === null) return;

    favorites.value = [...favorites.value, tag];

    resourceStore.updateAllPriorities();
  }

  /** 'Unfavorite' the selected tag.
   * @param  {string} tag Tag to unfavorite.
   * @description Removes tag from {@link favorites} array and calls {@link resetPriority}.
   */
  function removeFavorite(tag: string) {
    removeFromFavoriteArray(tag);
    resetPriority(tag);
  }

  function toggleFavorite(tag: string) {
    // console.log('before change ', tagLookup.value[tag].status);
    if (tagLookup.value[tag].status === TagStatus.favorite) removeFavorite(tag);
    else addFavorite(tag);

    // console.log('after change ', tagLookup.value[tag].status);
  }

  const isFavorite = computed(
    () => (tag: string) => favorites.value.indexOf(tag) !== -1
  );

  const isFilterInArray = computed(() => (tags: string[]) => {
    if (!tags) return false;
    if (filters.value.length <= 1) return false;
    const currentTagsString = tags.reduce((prev, cur) => `${prev} ${cur}`, "");
    const searchExpression = getFilterRegex();

    return searchExpression.test(currentTagsString);
  });

  // * Filter Functions
  function addFilter(tag: string) {
    const priorityBefore = Number(tagLookup.value[tag].priority) as TagPriority;
    filters.value = [...filters.value, tag];

    tagLookup.value[tag].status = TagStatus.filtered;
    tagLookup.value[tag].priority = TagPriority.filtered;

    removeFromFavoriteArray(tag);
    removeFromLessInterestedArray(tag);
    arrangeByPriority(tag, priorityBefore, TagPriority.filtered);
  }

  function removeFilter(tag: string) {
    resetPriority(tag);
    removeFromFilterArray(tag);
    // console.log(filters.value);
  }

  function toggleFilter(tag: string) {
    const tagIsFiltered = tagLookup.value[tag].status === TagStatus.filtered;
    if (tagIsFiltered) removeFilter(tag);
    else addFilter(tag);
  }

  const isFiltered = computed(
    () => (tag: string) => filters.value.indexOf(tag) !== -1
  );

  // * Less interested functions
  /**
   * Change tag status to 'less interested'
   * @param  {string} tag The tag name to be added to the 'less interested' list.
   * @details Changes tag status & priority, removes tag from favorite array and filter array, adds
   * tag to less interested array, and sorts tag list and resource list.
   */
  function addLessInterested(tag: string) {
    // !
    const priorityBefore = Number(tagLookup.value[tag].priority) as TagPriority;
    tagLookup.value[tag].status = TagStatus.lessInterested;
    tagLookup.value[tag].priority = TagPriority.lessInterested;

    removeFromFavoriteArray(tag);
    removeFromFilterArray(tag);

    arrangeByPriority(tag, priorityBefore, TagPriority.lessInterested);

    lessInterested.value = [...lessInterested.value, tag];
    // Move resource to front of array

    resourceStore.updateAllPriorities();
  }

  function removeLessInterested(tag: string) {
    resetPriority(tag);
    removeFromLessInterestedArray(tag);
  }

  function togglelessInterested(tag: string) {
    if (tagLookup.value[tag].status === TagStatus.lessInterested)
      removeLessInterested(tag);
    else addLessInterested(tag);
  }

  const isLessInterested = computed(
    () => (tag: string) => lessInterested.value.indexOf(tag) !== -1
  );

  /** Get all tags related to the tagOfInterest parameter */
  const getRelatedTags = computed(() => (tagOfInterest: string) => {
    let outArr: string[] = [];
    resourceStore.arr?.forEach((resource) => {
      if (resource.Tags === undefined || resource.Tags.indexOf(tagOfInterest) === -1) return; // do nothing if the resource does not have the tag of interest
      outArr = [...outArr, ...resource.Tags];
    });

    return outArr.filter(onlyUnique).filter((tag) => tag !== tagOfInterest);
  });

  const toUrl = computed(
    () => (tag: string) => tag.replace(/ /g, "_").replace(/\//g, "+")
  );
  const fromUrl = computed(
    () => (tag: string) => tag.replace(/_/g, " ").replace(/\+/g, "/")
  );
  /* eslint-disable object-property-newline */
  return {
    allTags,
    loadAllTags,
    tagLookup,
    activeCategoryTags,
    updateActiveCategoryTags: updateTagDisplay,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    filters,
    isFiltered,
    isFilterInArray,
    toggleFilter,
    addFilter,
    removeFilter,
    removeLessInterested,
    addLessInterested,
    togglelessInterested,
    isLessInterested,
    resetPriorityAll,
    resetPriority,
    bumpPriority,
    dropPriority,
    getRelatedTags,
    toUrl,
    fromUrl,
  };
});

export default useTagStore;
