// import "../node_modules/bulma/css/bulma.css"
import 'bulma/css/bulma.min.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router.js'

const bang = async (query) => {
    const bangs = [
        { bang: "!re",      url: "https://www.reddit.com/search/?q=%s" },
        { bang: "!rt",      url: "https://www.rottentomatoes.com/search?search=%s" },
        { bang: "!npm",     url: "https://www.npmjs.com/search?q=%s" },
        { bang: "!wr",      url: "https://www.wordreference.com/enfr/%s" },
        { bang: "!tr",      url: "https://www.deepl.com/fr/translator#en/fr/%s" },
        { bang: "!imdb",    url: "https://www.imdb.com/find?s=all&q=%s" },
        { bang: "!gh",      url: "https://github.com/search?q=%s" },
        { bang: "!yt",      url: "https://www.youtube.com/results?search_query=%s" },
        { bang: "!d",       url: "https://www.larousse.fr/dictionnaires/francais/%s" },
        { bang: "!g",       url: "https://www.google.com/search?q=%s" },
        { bang: "!c",       url: "https://www.conjugaisonfrancaise.com/recherche.html?q=%s" },
        { bang: "!iad",     url: "https://www.phind.com/search?q=%s&c=&source=searchbox&init=true" },
        { bang: "!gmap",    url: "https://www.google.fr/maps?hl=fr&q=%s" },
        { bang: "!img",     url: "https://duckduckgo.com/?q=%s&iax=images&ia=images" },
        { bang: "!ia",      url: "https://www.perplexity.ai/search/?q=%s" },
        { bang: "!yr",      url: "https://www.yr.no/en/search?q=%s" },
        { bang: "!ft",      url: "https://fitgirl-repacks.site/?s=%s" },
        { bang: "!gc",      url: "https://getcomics.org/?s=%s" },
        { bang: "!ow",      url: "https://open-webui.shokohsc.home/?q=%s"},
        { bang: "!gpt",     url: "https://chatgpt.com/?q=%s"},
        { bang: "!igg",     url: "https://igg-games.com/?s=%s"},
        { bang: "!hub",     url: "https://hub.docker.com/search?q=%s" },
        { bang: "!az",      url: "https://www.amazon.fr/s?k=%s" },
        { bang: "!du",      url: "https://https://duckduckgo.com/?q=%s" },
    ]

    try {
        const bangMatch = bangs.find(b => query.startsWith(b.bang))
        if (undefined === bangMatch)
            return undefined
        await window.open(bangMatch.url.replace('%s', encodeURIComponent(query.substring(bangMatch.bang.length + 1))), "_blank")
        return bangMatch.bang
    } catch (e) {
        console.log(e)
        Promise.reject(undefined)
    }
}

const pinia = createPinia()
const app = createApp(App)
pinia.use(() => ({ router: router }))
pinia.use(piniaPluginPersistedstate)

app.provide('bang', bang)
app.use(router)
app.use(pinia)
app.mount('#app')
