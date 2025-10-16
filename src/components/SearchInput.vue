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

const bangs = [
    { bang: "!re", url: "https://www.reddit.com/search/?q=%s" },
    { bang: "!rt", url: "https://www.rottentomatoes.com/search?search=%s" },
	{ bang: "!npm", url:"https://www.npmjs.com/search?q=%s" },
	{ bang: "!wr", url: "https://www.wordreference.com/enfr/%s" },
	{ bang: "!tr", url: "https://www.deepl.com/fr/translator#en/fr/%s" },
	{ bang: "!imdb", url: "https://www.imdb.com/find?s=all&q=%s" },
	{ bang: "!gh", url: "https://github.com/search?q=%s" },
	{ bang: "!yt", url: "https://www.youtube.com/results?search_query=%s" },
	{ bang: "!d", url:  "https://www.larousse.fr/dictionnaires/francais/%s" },
	{ bang: "!g", url:  "https://www.google.com/search?q=%s" },
	{ bang: "!c", url:  "https://www.conjugaisonfrancaise.com/recherche.html?q=%s" },
	{ bang: "!iad", url:"https://www.phind.com/search?q=%s&c=&source=searchbox&init=true" },
	{ bang: "!gmap", url: "https://www.google.fr/maps?hl=fr&q=%s" },
	{ bang: "!img", url:"https://duckduckgo.com/?q=%s&iax=images&ia=images" },
	{ bang: "!ia", url: "https://www.perplexity.ai/search/?q=%s" },
    { bang: "!yr", url: "https://www.yr.no/en/search?q=%s" }
]

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
</script>