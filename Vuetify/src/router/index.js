// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store.js'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Add',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: 'devices',
        name: 'Devices',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/DEVICES.vue'),
      },
      {
        path: 'rtu',
        name: 'RTU List',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/RTU.vue'),
      },
      {
        path: 'var',
        name: 'Add Var',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/VAR.vue'),
      },
      {
        path: 'editDevice',
        name: 'Edit Dev',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/EDITD.vue'),
      },
      {
        path: 'editVar',
        name: 'Edit Var',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/EDITV.vue'),
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

router.beforeEach((to, from, next) => {
  if ((to.path === '/editDevice' || to.path === '/editVar') && !store.state.navigationFlag) {
    next('/'); // Redirect to the home route if the user tries to access the /editDevice route
  } else {
    store.commit('clearNavigationFlag');
    next(); // Allow navigation for other routes
  }
});


export default router
