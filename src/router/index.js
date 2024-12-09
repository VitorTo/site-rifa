import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/firebaseConfig';
// import Home from '../views/NewHome.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Gerencial from '../views/Gerencial.vue';
// import Gerencial from '../views/NewGerencial.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  {
    path: '/gerencial',
    component: Gerencial,
    meta: { requiresAuth: true }, // Rota protegida
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;

  if (to.meta.requiresAuth && !user) {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;
