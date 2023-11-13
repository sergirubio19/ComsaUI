/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Import the Vuex store

// Plugins
import { registerPlugins } from '@/plugins';

const app = createApp(App);

registerPlugins(app);

// Use the Vuex store with your app
app.use(store);

// Call the fetchData action here
store.dispatch('fetchData');

app.mount('#app');