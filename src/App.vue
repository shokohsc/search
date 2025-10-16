<template>
  <router-view />
</template>

<script setup>
import getEnv from "./utils/env";
import { onMounted } from 'vue';

const API_BASE = getEnv("API_URL");

const setRandomBackground = async () => {
  try {
    const response = await fetch(`https://${API_BASE}/api/image/random`)
    if (!response.ok) throw new Error('Network response not ok')
    const blob = await response.blob()
    const imageUrl = URL.createObjectURL(blob)
    document.body.style.backgroundImage = `url(${imageUrl})`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundPosition = 'center center'
  } catch (error) {
    console.error('Failed to fetch and set background image:', error)
  }
}

onMounted(async () => {
    await setRandomBackground()
});

</script>

<style>
</style>
