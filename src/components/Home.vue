<template>
    <section class="section">
        <div class="container">
            <h1 class="title has-text-centered">Cute Search Engine</h1>
            <SearchInput v-model="searchTerm" @search="onSearch" />
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import SearchInput from './SearchInput.vue';

const router = useRouter();
const searchStore = useSearchStore();

const searchTerm = ref('');
const onSearch = async () => {
    await searchStore.fetchResults(searchTerm.value);
    router.push({ name: 'Results', query: { q: searchTerm.value } });
};
</script>
