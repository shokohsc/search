<template>
    <div class="box">
        <form @submit.prevent="onSearch" class="field has-addons">
            <div class="control is-expanded">
                <input class="input" type="search" placeholder="What are you looking for?" v-model="searchTerm" required />
            </div>

            <div class="control">
                <button type="submit" class="button is-primary">
                    Search
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/search';
const bang = inject('bang')

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();

const searchTerm = ref('');

onMounted(async () => {
    try {
        const query = route.query.q;
        if (query) {
            searchTerm.value = query;
            await onSearch();
        }
    } catch (e) {
        console.log(e)
        Promise.reject(e)
    }
});

// Run the search and go to the results page
const onSearch = async () => {
    try {
        await searchStore.fetchRemainingRequests()
        if (0 === searchStore.remainingRequests)
            searchTerm.value = `!du ${searchTerm.value}`
        const b = await bang(searchTerm.value)
        if (undefined !== b) {
            return undefined
        }
        await searchStore.fetchResults(searchTerm.value);
        router.push({ name: 'Results', query: { q: searchTerm.value } }); // push query param
    } catch (e) {
        console.log(e)
        Promise.reject(e)
    }
};
</script>