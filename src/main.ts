import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router/routes.ts'
import ui from "@nuxt/ui/vue-plugin";
import {VueShowdownPlugin} from 'vue-showdown';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ui)

// Markdown: the second parameter of app.use() is optional
app.use(VueShowdownPlugin, {
    // set default flavor of showdown
    flavor: 'github',
    // set default options of showdown (will override the flavor options)
    options: {
        emoji: false,
    },
});

app.mount('#app')
