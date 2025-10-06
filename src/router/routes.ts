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
import RoleDetailsPage from "@/views/RoleDetailsPage.vue";
import Profile from "@/views/Profile.vue";

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
            meta: {requiresAuth: true},
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
            path: '/roles/:id',
            name: 'role-details',
            component: RoleDetailsPage,
            meta: {requiresAuth: true},
            beforeEnter: [isAdmin]
        }, {
            path: '/users/:id',
            name: 'user-detail',
            component: UserDetailsPage,
            meta: {requiresAuth: true},
            beforeEnter: [isAdmin]
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
        }, {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: {requiresAuth: true}
        },
    ],
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(); // Get access to your auth store
    // Check if the route requires authentication
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        // If it requires auth and the user is not authenticated, redirect to log in
        next({name: 'login'});
    } else if ((to.name === 'login' || to.name === "register") && authStore.isLoggedIn) {
        // If the user is already logged in and tries to go to log in, redirect to home
        next({name: 'home'});
    } else {
        next();
    }
});

async function isAdmin(to: RouteLocationNormalized, from:  RouteLocationNormalized, next:  RouteLocationNormalized) {
    const authStore = useAuthStore();

    // Await the promise if it exists. It's created on login/app load.
    if (authStore.adminCheckPromise) {
        await authStore.adminCheckPromise;
    } else if (authStore.isLoggedIn) {
        // If logged in but promise is missing (e.g. HMR), run check.
        await authStore.checkIsAdmin();
    }

    if (authStore.isAdmin) {
        next(); // User is admin, proceed.
    } else {
        // User is not admin.
        // Redirect to the page they came from, or home if it's a direct navigation.
        if (from.fullPath && from.fullPath !== '/') {
            next(from);
        } else {
            next({name: 'home'});
        }
    }
}

export default router