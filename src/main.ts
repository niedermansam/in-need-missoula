import { createApp } from "vue";
import { createPinia } from "pinia";
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import './index.css'

import App from "./App.vue";
import router from "./router";

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount("#app");

// App.use(BootstrapVue);
