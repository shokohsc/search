<template>
    <section class="section">
        <div class="container">
            <h1 class="title has-text-centered">
                <RouterLink class="has-text-white" to="/">Cute Search Engine</RouterLink>
            </h1>
            <SearchInput />
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
                    <div class="box result">
                        <p class="is-size-6">
                            <a class="has-text-grey" :href="result.link" target="_blank" rel="noopener noreferrer">
                                {{ result.link }}
                            </a>
                        </p>
                        <p class="is-size-5 is-flex is-align-items-center">
                            <img
                                v-if="faviconUrl(result.link)"
                                :src="faviconUrl(result.link)"
                                alt=""
                                class="favicon"
                                height="24"
                                loading="lazy"
                                @error="handleFaviconError"
                            />
                            <a :href="result.link" target="_blank" rel="noopener noreferrer">
                                {{ result.title }}
                            </a>
                        </p>

                        <p class="mb-2">
                            <span v-if="result.date" class="has-text-grey is-size-6">
                                {{ result.date }}
                            </span>
                            {{ result.snippet }}
                        </p>

                        <p v-if="result.provider" class="is-size-7 has-text-grey has-text-right">
                            {{ result.provider.toUpperCase() }}
                        </p>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useSearchStore } from '@/stores/search';
import SearchInput from './SearchInput.vue';

const searchStore = useSearchStore();

const faviconUrl = (url) => {
    try {
        const host = new URL(url).origin;
        return `${host}/favicon.ico`;
    } catch (e) {
        console.error(e);
        return `favicon.svg`;
    }
};

// Add this function to handle favicon loading errors
const handleFaviconError = (event) => {
    event.target.src = 'favicon.svg';
};
</script>

<style scoped>
.result {
    border-bottom: 1px solid rgb(84, 84, 84);
    margin-bottom: 1rem;
}
.favicon {
    height: 1em;
    width: auto;
    vertical-align: middle;
    margin-right: 0.5rem;
}
</style>