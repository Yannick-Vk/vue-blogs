import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import UsersPage from "@/views/UsersPage.vue";
import RolesPage from "@/views/RolesPage.vue";
import UserDetailsPage from "@/views/UserDetailsPage.vue";
import BlogDetail from "@/views/BlogDetail.vue";
import CreateBlogForm from "@/views/CreateBlogForm.vue";

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
        }, {
            path: '/register',
            name: 'register',
            component: Register,
        }, {
            path: '/blog/:id',
            name: 'blog-detail',
            component: BlogDetail,
        }, {
            path: '/users',
            name: 'users',
            component: UsersPage,
        }, {
            path: '/roles',
            name: 'roles',
            component: RolesPage,
        }, {
            path: '/users/:id',
            name: 'user-detail',
            component: UserDetailsPage,
        }, {
            path: '/blogs/new',
            name: 'create-blog',
            component: CreateBlogForm,
        },
    ],
})

export default router