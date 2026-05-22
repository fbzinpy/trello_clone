import { defineStore } from 'pinia'

// Store global de autenticacion.
// Pinia permite leer token/user desde cualquier componente sin pasar props.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Se inicializa desde localStorage para mantener la sesion al recargar.
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  actions: {
    // Guarda el JWT recibido del backend despues del login.
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    // Guarda datos basicos del usuario autenticado.
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    // Limpia estado y storage; se usa al cerrar sesion.
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
