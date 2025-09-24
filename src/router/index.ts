import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Login from "@/views/Login.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            alias: "/home"
        }, {
            path: '/login',
            name: 'login',
            component: Login,
        },
    ],
})

export default router
