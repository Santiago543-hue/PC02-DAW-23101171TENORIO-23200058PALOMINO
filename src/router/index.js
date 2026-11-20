import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'countries',
      component: () => import('../pages/CountriesPage.vue'),
    },
    {
      path: '/country/:code',
      name: 'country-detail',
      component: () => import('../components/CountryDetail.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
