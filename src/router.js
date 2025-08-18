import { createRouter, createWebHistory } from 'vue-router'

import Home from './components/Home.vue';
import Results from './components/Results.vue';

const routes = [
  {
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'Results',
    path: '/search',
    component: Results
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to, from, failure) => {
  window.scrollTo(0, 0)
})

export default router
