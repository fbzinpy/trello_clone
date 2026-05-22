import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Punto de entrada del frontend:
// crea la app Vue, registra Pinia para estado global y Vue Router para paginas.
const app = createApp(App)

// Pinia debe instalarse antes de usar stores como useAuthStore().
app.use(createPinia())
// Router habilita <router-view>, <router-link> y las rutas protegidas.
app.use(router)

// Monta toda la aplicacion dentro del div #app de index.html.
app.mount('#app')
