import axios from 'axios'
import { useAuthStore } from './store/auth'

// Cliente HTTP centralizado.
// Todo lo que use "api" apunta al backend Express en /api.
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

// Interceptor: antes de cada request revisa si hay token guardado.
// Si existe, lo manda como Bearer token para que el backend autorice la peticion.
api.interceptors.request.use((config) => {
  const auth = useAuthStore()

  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})

export default api
