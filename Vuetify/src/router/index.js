// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store.js'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: 'building',
        name: 'Set Building',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/BUILDING.vue'),
      },
      {
        path: '',
        name: 'Add',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'devices',
        name: 'Devices',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/DEVICES.vue'),
      },
      {
        path: 'var',
        name: 'Add Var',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/VAR.vue'),
      },
      {
        path: 'yaml',
        name: 'YAML',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/FILE.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
/*
router.beforeEach((to, from, next) => {
  if ((to.path === '/editDevice' || to.path === '/editVar') && !store.state.navigationFlag) {
    next('/'); // Redirect to the home route if the user tries to access the /editDevice route
  } else {
    store.commit('clearNavigationFlag');
    next(); // Allow navigation for other routes
  }
});
*/

export default router
