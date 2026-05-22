import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Precios from '../views/Precios.vue'
import { useAuthStore } from '../store/auth'

// Cada objeto representa una pagina.
// meta.requiresAuth marca las rutas que solo se pueden ver con sesion iniciada.
const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/precios', component: Precios }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardia global de navegacion.
// Antes de entrar a una ruta protegida revisa el token en Pinia/localStorage.
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    return '/'
  }
})

export default router
