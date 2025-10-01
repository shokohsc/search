<template>
    <section class="section">
        <div class="container">
            <SearchInput v-model="localSearch" @search="onSearch" />
            <h1 class="title has-text-centered mb-2">Results for “{{ searchStore.query }}”</h1>
            <p v-if="searchStore.duration" class="subtitle is-6 has-text-centered has-text-grey">
                {{ searchStore.results.length }} results fetched in {{ searchStore.duration }} ms
            </p>

            <div v-if="searchStore.loading" class="has-text-centered">
                <progress class="progress is-primary" max="100"></progress>
                <p>Loading…</p>
            </div>

            <div v-else-if="searchStore.error" class="notification is-danger">
                {{ searchStore.error }}
            </div>

            <div v-else-if="searchStore.results.length === 0" class="notification is-info">
                No results found.
            </div>

            <div v-else>
                <article v-for="(result, index) in searchStore.results" :key="index">
                    <div class="result">
                        <p class="is-size-6">
                            <a class="has-text-grey" :href="result.link" target="_blank" rel="noopener noreferrer">
                                {{ result.link }}
                            </a>
                        </p>
                        <p class="is-5 is-flex is-align-items-center">
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
                        </p>

                        <p>
                            <span v-if="result.date" class="has-text-grey is-size-7 mr-2">
                                {{ result.date }}
                            </span>
                            {{ result.snippet }}
                        </p>

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
import SearchInput from './SearchInput.vue';

const searchStore = useSearchStore();
const route = useRoute();
const router = useRouter();

const localSearch = ref('');

onMounted(() => {
    const query = route.query.q;
    if (query) {
        localSearch.value = query;
        searchStore.fetchResults(query);
    }
});
const onSearch = async () => {
    await searchStore.fetchResults(localSearch.value);
    router.push({ name: 'Results', query: { q: localSearch.value } });
};

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
.result {
    border-bottom: 1px solid grey;
    margin-bottom: 1rem;
}
.favicon {
    height: 1em;
    width: auto;
    vertical-align: middle;
    margin-right: 0.5rem;
}
</style>