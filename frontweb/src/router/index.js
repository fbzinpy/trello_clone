import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Precios from '../views/Precios.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/precios', component: Precios }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
