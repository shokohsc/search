<template>
    <section class="section">
        <div class="container">
            <!-- Search bar stays on top of results -->
            <div class="box">
                <form @submit.prevent="onSearch" class="field has-addons">
                    <div class="control is-expanded">
                        <input class="input" type="search" placeholder="What are you looking for?" v-model="localSearch"
                            required />
                    </div>

                    <div class="control">
                        <button type="submit" class="button is-primary">
                            Search
                        </button>
                    </div>
                </form>
            </div>

            <h1 class="title has-text-centered mb-2">Results for “{{ searchStore.query }}”</h1>
            <p v-if="searchStore.duration" class="subtitle is-6 has-text-centered has-text-grey">
                {{ searchStore.results.length }} results fetched in {{ searchStore.duration }} ms
            </p>

            <!-- Loading state -->
            <div v-if="searchStore.loading" class="has-text-centered">
                <progress class="progress is-primary" max="100"></progress>
                <p>Loading…</p>
            </div>

            <!-- Error state -->
            <div v-else-if="searchStore.error" class="notification is-danger">
                {{ searchStore.error }}
            </div>

            <!-- No results found -->
            <div v-else-if="searchStore.results.length === 0" class="notification is-info">
                No results found.
            </div>

            <!-- Results list -->
            <div v-else>
                <article v-for="(result, index) in searchStore.results" :key="index" class="box">
                    <div class="content">
                        <!-- ③ Result URL (smaller font, above title) -->
                        <p class="is-size-7">
                            <a class="has-text-grey" :href="result.link" target="_blank" rel="noopener noreferrer">
                                {{ result.link }}
                            </a>
                        </p>
                        <!-- Title with favicon -->
                        <h2 class="title is-5">
                            <div class="is-flex is-align-items-center">
                                <img
                                    v-if="faviconUrl(result.link)"
                                    :src="faviconUrl(result.link)"
                                    alt=""
                                    class="favicon"
                                    height="24"
                                />
                                <a :href="result.link" target="_blank" rel="noopener noreferrer">
                                    {{ result.title }}
                                </a>
                            </div>
                        </h2>

                        <!-- ② Date left of snippet -->
                        <p>
                            <span v-if="result.date" class="has-text-grey is-size-7 mr-2">
                                {{ result.date }}
                            </span>
                            {{ result.snippet }}
                        </p>

                        <!-- Optional provider list -->
                        <p v-if="result.provider" class="is-size-7 has-text-grey has-text-right">
                            {{ result.provider }}
                        </p>
            </div>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useSearchStore } from '@/stores/search';
import { useRoute, useRouter } from 'vue-router';
import { ref, watch, onMounted } from 'vue';

const searchStore = useSearchStore();
const route = useRoute();
const router = useRouter();

// keep a local copy for the search input
const localSearch = ref(route.query.q || '');

const onSearch = async () => {
    await searchStore.fetchResults(localSearch.value);
    router.replace({ name: 'Results', query: { q: localSearch.value } });
};

// sync store when URL query changes (e.g. back/forward navigation)
watch(
    () => route.query.q,
    async (newQuery) => {
        if (newQuery !== searchStore.query) {
            localSearch.value = newQuery || '';
            await searchStore.fetchResults(newQuery || '');
        }
    },
    { immediate: true }
);

/* ---------- NEW helper to pull favicon ---------- */
const faviconUrl = (url) => {
    try {
        const host = new URL(url).origin;
        return `${host}/favicon.ico`;
    } catch (_) {
        return null;
    }
};
</script>

<style scoped>
.box+.box {
    margin-top: 0.5rem;
}
/* ① Favicon matches the font size of the title and has a little gap */
.favicon {
    height: 1em;          /* same height as the current font */
    width: auto;         /* keep aspect ratio */
    vertical-align: middle;
    margin-right: 0.5rem; /* gap between icon & title */
}
</style>