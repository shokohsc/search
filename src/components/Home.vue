<!-- src/pages/Home.vue -->
<template>
    <section class="section">
        <div class="container">
            <h1 class="title has-text-centered">Cute Search Engine</h1>

            <div class="box">
                <form @submit.prevent="onSearch" class="field has-addons">
                    <div class="control is-expanded">
                        <input class="input" type="search" placeholder="What are you looking for?" v-model="searchTerm"
                            required />
                    </div>

                    <div class="control">
                        <button type="submit" class="button is-primary">
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/search';

const router = useRouter();
const searchStore = useSearchStore();

const searchTerm = ref('');

// Run the search and go to the results page
const onSearch = async () => {
    await searchStore.fetchResults(searchTerm.value);
    router.push({ name: 'Results', query: { q: searchTerm.value } }); // push query param
};
</script>

<style scoped>
/* Optional, keep the look tidy */
</style>