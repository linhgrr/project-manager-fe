import {createRouter, createWebHistory} from 'vue-router';
import LoginPage from '@/components/user/LoginPage.vue';
import {createApp} from "vue";
import App from "@/App.vue";
import RegisterPage from "@/components/user/RegisterPage.vue";
import MainPage from "@/components/user/MainPage.vue";
import PaymentResult from "@/components/subscription/PaymentResult.vue";
import PaymentComponent from "@/components/subscription/PaymentComponent.vue";

const routes = [
    { path: '/', component: MainPage, meta: { requiresAuth: true } },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/payment-result', component: PaymentResult},
    { path: '/payment', component: PaymentComponent}
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
