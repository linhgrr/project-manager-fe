import {createRouter, createWebHistory} from 'vue-router';
import LoginPage from '@/components/user/LoginPage.vue';
import {createApp} from "vue";
import App from "@/App.vue";
import RegisterPage from "@/components/user/RegisterPage.vue";
import MainPage from "@/components/user/MainPage.vue";

const routes = [
    { path: '/', component: MainPage, meta: { requiresAuth: true } },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Kiểm tra JWT trong localStorage

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});


createApp(App)
    .use(router)
    .mount('#app')
