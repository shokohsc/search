import getEnv from "../utils/env";
import { defineStore, acceptHMRUpdate } from "pinia";

const API_BASE = getEnv("API_URL");

export const useSearchStore = defineStore("search", {
  state: () => ({
    query: "",
    results: [],
    loading: false,
    error: null,
    duration: null,
  }),

  actions: {
    /**
     * Trigger a search against the external API.
     * @param {string} query – The search term.
     */
    async fetchResults(query) {
      this.query = query;
      this.loading = true;
      this.error = null;
      this.duration = null;

      const start = Date.now();

      try {
        const response = await fetch(
          `https://${API_BASE}/search?query=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        this.results = data;
      } catch (err) {
        this.error = err.message || "Unknown error";
        this.results = [];
      } finally {
        this.loading = false;
        this.duration = Date.now() - start;
      }
    },
  },

  getters: {
    faviconUrl: () => (url) => {
      try {
        const host = new URL(url).origin;
        return `${host}/favicon.ico`;
      } catch (_) {
        return null;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot));
}

export default useSearchStore;

