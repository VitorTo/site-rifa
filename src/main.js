import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useAppStore } from './store/appStore';

const app = createApp(App);
const pinia = createPinia(useAppStore);

app.use(pinia);
app.use(router);
app.mount('#app');