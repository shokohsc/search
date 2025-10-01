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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/search';

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();

const searchTerm = ref('');

onMounted(() => {
    const query = route.query.q;
    if (query) {
        searchTerm.value = query;
    }
});

// Run the search and go to the results page
const onSearch = async () => {
    await searchStore.fetchResults(searchTerm.value);
    router.push({ name: 'Results', query: { q: searchTerm.value } }); // push query param
};
</script>