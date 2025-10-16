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
import { ref, onMounted, inject, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/search';
const bangs = inject('bangs')

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
    const bangMatch = bangs.find(b => searchTerm.value.startsWith(b.bang))
    if (undefined !== bangMatch) {
        await window.open(bangMatch.url.replace('%s', encodeURIComponent(searchTerm.value.substring(bangMatch.bang.length + 1))), "_blank")
        return
    }
    await searchStore.fetchResults(searchTerm.value);
    router.push({ name: 'Results', query: { q: searchTerm.value } }); // push query param
};

watch(
    () => route.query.q,
    async (q) => {
        if (q) {
            const bangMatch = bangs.find(b => q.startsWith(b.bang))
            if (undefined !== bangMatch) {
                await window.open(bangMatch.url.replace('%s', encodeURIComponent(q.substring(bangMatch.bang.length + 1))), "_blank")
                return
            }
        }
    },
    { immediate: true }
);
</script>