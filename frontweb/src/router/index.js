import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Precios from '../views/Precios.vue'
import { useAuthStore } from '../store/auth'

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/precios', component: Precios }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    return '/'
  }
})

export default router
