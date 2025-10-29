import getEnv from "../utils/env";
import { defineStore, acceptHMRUpdate } from "pinia";

const API_BASE = getEnv("API_URL");

export const useSearchStore = defineStore("search", {
  state: () => ({
    query: "",
    results: [],
    remainingRequests: 0,
    suggestions: [],
    loading: false,
    loadingSuggestions: false,
    error: null,
    duration: null,
  }),

  actions: {
    /**
     * Trigger a search against the external API.
     * @param {string} q – The search term.
     */
    async fetchResults(q) {
      this.query = q
      this.loading = true;
      this.error = null;
      this.duration = null;

      const start = Date.now();

      try {
        const response = await fetch(
          `https://${API_BASE}/search`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: q,
              count: 20
            })
          }
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
    async fetchRemainingRequests() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(
          `https://${API_BASE}/search/remaining/requests`, {
            headers: {
              "Content-Type": "application/json",
            }
          }
        );

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        this.remainingRequests = data;
      } catch (err) {
        this.error = err.message || "Unknown error";
        this.remainingRequests = 0;
      } finally {
        this.loading = false;
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
