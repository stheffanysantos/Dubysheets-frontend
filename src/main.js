import { createApp } from 'vue';
import App from './App.vue';
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import router from '@/routes/router.js'; 

// Crie a instância do app
const app = createApp(App);

// Use o plugin globalmente
app.use(BootstrapVue3);
app.use(router);
// Monte o app
app.mount('#app');
