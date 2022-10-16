import { defineStore } from "pinia";
import type { ResourceSchema } from "@/schemas/ResourceSchemas";
import { TagPriority } from "@/schemas/TagSchemas";
import { useAPI } from "@/hooks";
import { useCategoryStore, useTagStore, useUserStore } from './index'; // eslint-disable-line

const resourceAPI = useAPI("/resources"); // 'http://127.0.0.1:3000/resources';

const useResourceStore = defineStore("resourceStore", {
  state: () => ({
    /** @type {boolean} true if resource data has been loaded, otherwise false.
     * @default false
     */
    dataLoaded: false as boolean,

    /** @type {boolean} true if resource data is currently loading, otherwise false.
     * @default false
     */
    loading: false as boolean,

    /** @type {string} error to pass on to user.
     *  @default '' */
    error: "",

    arr: [] as ResourceSchema[] | null,
    lookup: {} as { [key: string]: ResourceSchema },
  }),
  actions: {
    /** Loads all resources into the client. */
    async loadData() {
      if (this.dataLoaded === true) return; // exit function if data is already loaded
      this.loading = true;

      try {
        // Get data from API
        const response = await fetch(resourceAPI, {
          headers: {
            accept: "application/json",
          },
        });
        if (response.ok === true) {
          // if response is good, handle incoming data
          const json = await response.json();
          this.arr = json;
          this.createLookupTable();

          // and set loading variable accordingly
          this.dataLoaded = true;
          this.loading = false;
        } else {
          // if the API throws an error, handle the error
          this.error = "Error fetching data";
          this.loading = false;
        }
      } catch (error: any) {
        // Handle any other caught errors
        // I think this is a niche case when using fetch(?)
        this.error = `Error fetching data. ${error.message}`;
        this.loading = false;
      }
    },
    /** Creates an object where each key is the id of a resource. */
    createLookupTable() {
      if (this.arr === null) return;

      // add each element of the array to an object
      // with "id" as the key
      this.arr.forEach((x) => {
        this.lookup[x.id] = x;
        this.lookup[x.id].priority = TagPriority.none;
      });
    },

    /** Update the priority of one resource.
     * @param  {ResourceSchema} resource The resource to find and update.
     * @param  {number} newPriority The new priority of the resource.
     * @details Only called in {@link this.updateAllPriorities}.
     */
    changeResourcePriority(resource: ResourceSchema, newPriority: number) {
      const resourceIndex = this.arr?.indexOf(resource);
      if (resourceIndex === undefined || this.arr === null) return;
      this.arr[resourceIndex].priority = newPriority;
    },

    /** Update the priority of all resources.
     * @details Iterates through {@link this.arr} and calls {@link this.changeResourcePriority} for each resource in the array.
     */
    updateAllPriorities() {
      if (this.arr === null) return;

      const tagStore = useTagStore();
      this.arr.forEach((resource) => {
        // compute resource priority by summing the priority of each tag associated with the resource
        const newPrioritySum = resource.Tags.reduce(
          (prev, tag) => prev + tagStore.tagLookup[tag].priority,
          0
        );
        this.changeResourcePriority(resource, newPrioritySum);
      });
      /* from tagStore
      this.arr?.forEach((x, i, arr) => {
        if (x.Tags.indexOf(tag) > -1) {
          const removedElement = this.arr?.splice(i, 1);
          if (removedElement) this.arr?.unshift(removedElement[0]);
        }
      });
      */
      // this.arr = this.arr.sort((a, b) => b.priority - a.priority)
    },
  },
  getters: {
    filteredArray: (state): ResourceSchema[] => {
      if (!state.arr) return [];

      const categoryStore = useCategoryStore();
      const tagStore = useTagStore();

      const filteredArray = state.arr.filter((x) => {
        // TODO: Handle resource with no tags
        // ! The app breaks if a resource is added to the database with no tags
        // ? did I fix it by changing this return statement to false?
        if (!x.Tags) return false;

        // Handle Category Filters
        const isFilteredByCategory = categoryStore.isFiltered(x.Provides);
        if (isFilteredByCategory) return false;

        // Handle Tag Filters
        const isFilteredByTag = tagStore.isFilterInArray(x.Tags);
        if (isFilteredByTag) return false;

        // TODO: Handle Exclusive Communities Filters

        // TODO: Handle Funding Filters

        return true; // return item if all tests pass
      });

      return filteredArray.sort((a, b) => b.priority - a.priority);
    },
    userSearchResults: (state) => () => {
      // console.log('before state.arr check')
      const userStore = useUserStore();
      const regex = userStore.searchRegEx;
      if (state.arr === null) return [];
      // console.log(state.arr)
      const filteredArray = state.arr.filter((resource) => {
        const searchString = `${resource.Name} 
          ${resource.Provides} ${resource.Tags.join(" ")}
          ${resource.Notes}`;
        // console.log(searchString);
        return regex.test(searchString);
      });
      return filteredArray;
    },
    getByTag:
      (state): ((tag: string) => ResourceSchema[] | undefined) =>
      (tag: string) => {
        if (!state.arr) return;
        const outArr = state.arr.filter(
          (resource) => resource.Tags.indexOf(tag) !== -1
        );
        console.log(outArr);
      return outArr;// eslint-disable-line
      },
  },
});

export default useResourceStore;
