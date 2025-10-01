import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import UsersPage from "@/views/UsersPage.vue";
import RolesPage from "@/views/RolesPage.vue";
import UserDetailsPage from "@/views/UserDetailsPage.vue";
import BlogDetail from "@/views/BlogDetail.vue";
import CreateBlogForm from "@/views/CreateBlogForm.vue";
import {useAuthStore} from "@/stores/auth.ts";
import EditBlog from "@/views/EditBlog.vue";
import MyBlogs from "@/views/MyBlogs.vue";

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
            path: '/blog/:id/edit',
            name: 'blog-edit',
            component: EditBlog,
        }, {
            path: '/users',
            name: 'users',
            component: UsersPage,
            meta: {requiresAuth: true},
            beforeEnter: [isAdmin]
        }, {
            path: '/roles',
            name: 'roles',
            component: RolesPage,
            meta: {requiresAuth: true},
            beforeEnter: [isAdmin]
        }, {
            path: '/users/:id',
            name: 'user-detail',
            component: UserDetailsPage,
            meta: {requiresAuth: true}
        }, {
            path: '/blog/new',
            name: 'create-blog',
            component: CreateBlogForm,
            meta: {requiresAuth: true}
        }, {
            path: '/me/blogs',
            name: 'my-blogs',
            component: MyBlogs,
            meta: {requiresAuth: true}
        },
    ],
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(); // Get access to your auth store
    // Check if the route requires authentication
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        // If it requires auth and the user is not authenticated, redirect to login
        next({name: 'login'});
    } else if (to.name === 'login' && authStore.isLoggedIn) {
        // If the user is already logged in and tries to go to log in, redirect to home
        next({name: 'home'});
    } else {
        next();
    }
});

// Disables a given route if the user does not have an admin role and returns to their original page
// If browsed directly, redirects to 'root'
async function isAdmin(to, from, next) {
    const authStore = useAuthStore();
    if (authStore.isAdmin) {
        next();
        return;
    }
    next(from);
}

export default router