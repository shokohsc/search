import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "node:url";


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true, // Source map generation must be turned on
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 80,
    hmr: {
      clientPort: 443
    },
    allowedHosts: [
      "localhost",
      "dev.search.shokohsc.home",
      "preview.search.shokohsc.home",
      "search.dev-search"
    ]
  }
})
