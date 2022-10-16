import { defineStore } from "pinia";
import type { FileInterface } from "@/schemas";
import { useAPI } from "@/hooks";

const fileAPI = useAPI("/files");

const useFileStore = defineStore("fileStore", {
  state: () => ({
    loaded: false as boolean,
    loading: false as boolean,
    error: "",
    arr: [] as FileInterface[] | null,
    lookup: {} as { [key: string]: FileInterface },
  }),
  actions: {
    async loadData() {
      if (this.loaded) return; // exit function if data is already loaded
      this.loading = true;

      try {
        // Get data from API
        const response = await fetch(fileAPI, {
          headers: {
            accept: "application/json",
          },
        });
        if (response.ok) {
          // if response is good, handle incoming data
          const json = await response.json();
          this.arr = json;
          this.createLookupTable();

          // and set loading variable accordingly
          this.loaded = true;
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
    createLookupTable() {
      if (!this.arr) return; // exit function if data doesn't exist

      // add each element of the array to an object
      // with "id" as the key
      this.arr.forEach((x) => {
        this.lookup[x.id] = x;
      });
    },
  },
});

export default useFileStore;
/*
export const useResourceStore = defineStore('fileStore', () => {

});

export const useContactStore = defineStore('contactStore', () => {

});
*/
