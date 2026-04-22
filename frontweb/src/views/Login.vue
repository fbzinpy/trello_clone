<template>
  <!-- NAVBAR -->
  <nav class="navbar">
    <div class="navbar-left">
      <svg viewBox="0 0 24 24" fill="none" aria-label="Logo" width="32" height="32">
        <rect width="24" height="24" rx="4" fill="#0052CC"/>
        <rect x="4" y="5" width="6" height="10" rx="1.5" fill="white"/>
        <rect x="14" y="5" width="6" height="7" rx="1.5" fill="white"/>
      </svg>
      <span class="logo-text">TrelloClone</span>
    </div>

    <div class="navbar-right">
      <!-- Funciones -->
      <div class="nav-item" @mouseenter="openMenu('funciones')" @mouseleave="closeMenu">
        <span class="nav-link">Funciones ▾</span>
        <div class="dropdown" v-show="activeMenu === 'funciones'">
          <p class="dropdown-title">Stack Técnico</p>
          <ul>
            <li>⚡ Vue.js 3 + Vite</li>
            <li>🟢 Node.js + Express</li>
            <li>🗄️ PostgreSQL</li>
            <li>🔷 Prisma ORM</li>
            <li>🔐 JWT + bcryptjs</li>
            <li>📡 Axios</li>
            <li>🍍 Pinia (estado)</li>
          </ul>
        </div>
      </div>

      <!-- Planes -->
      <div class="nav-item" @mouseenter="openMenu('planes')" @mouseleave="closeMenu">
        <span class="nav-link">Planes ▾</span>
        <div class="dropdown" v-show="activeMenu === 'planes'">
          <p class="dropdown-title">Elige tu plan</p>
          <ul>
            <li><strong>Free</strong> — Hasta 10 tableros</li>
            <li><strong>Pro</strong> — Tableros ilimitados</li>
            <li><strong>Team</strong> — Colaboración avanzada</li>
            <li><strong>Enterprise</strong> — Control total</li>
          </ul>
        </div>
      </div>

      <!-- Precios → redirige a /precios -->
      <router-link to="/precios" class="nav-link">Precios</router-link>

      <button class="btn-nav-login" @click="scrollToForm">Iniciar sesión</button>
      <button class="btn-nav-register" @click="scrollToForm">Regístrate gratis</button>
    </div>
  </nav>

  <!-- HERO -->
  <main class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Captura, organiza y gestiona tus tareas en cualquier lugar.</h1>
      <p class="hero-sub">Escapa del desorden: da rienda suelta a tu productividad con TrelloClone.</p>

      <div class="form-wrapper" ref="formRef">
        <div class="tabs">
          <button :class="['tab', { active: mode === 'login' }]" @click="mode = 'login'">Iniciar sesión</button>
          <button :class="['tab', { active: mode === 'register' }]" @click="mode = 'register'">Registrarse</button>
        </div>
        <div class="form-body">
          <input v-model="email" type="email" placeholder="Correo electrónico" class="form-input" />
          <input v-model="password" type="password" placeholder="Contraseña" class="form-input" />
          <p v-if="mensaje" :class="['mensaje', mensajeOk ? 'ok' : 'error']">{{ mensaje }}</p>
          <button v-if="mode === 'login'" class="btn-primary" @click="login" :disabled="loading">
            {{ loading ? 'Cargando...' : 'Entrar' }}
          </button>
          <button v-else class="btn-primary" @click="register" :disabled="loading">
            {{ loading ? 'Cargando...' : 'Crear cuenta gratis' }}
          </button>
          <p class="terms">
            Al continuar, aceptas los <a href="#">Términos de servicio</a> y la <a href="#">Política de privacidad</a>.
          </p>
        </div>
      </div>
    </div>

    <div class="hero-visual" aria-hidden="true">
      <div class="board-preview">
        <div class="board-col">
          <div class="board-col-title">Por hacer</div>
          <div class="board-card">Diseñar pantalla login</div>
          <div class="board-card">Conectar con API</div>
        </div>
        <div class="board-col">
          <div class="board-col-title">En progreso</div>
          <div class="board-card highlight">Crear base de datos</div>
          <div class="board-card">Setup del proyecto</div>
        </div>
        <div class="board-col">
          <div class="board-col-title">Listo</div>
          <div class="board-card done">Instalar dependencias</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const mode = ref('login')
const loading = ref(false)
const mensaje = ref('')
const mensajeOk = ref(false)
const formRef = ref(null)
const activeMenu = ref(null)

let closeTimer = null

function openMenu(name) {
  clearTimeout(closeTimer)
  activeMenu.value = name
}

function closeMenu() {
  closeTimer = setTimeout(() => { activeMenu.value = null }, 150)
}

function scrollToForm() {
  formRef.value?.scrollIntoView({ behavior: 'smooth' })
}

function showMsg(text, ok = false) {
  mensaje.value = text
  mensajeOk.value = ok
  setTimeout(() => { mensaje.value = '' }, 4000)
}

async function login() {
  if (!email.value || !password.value) return showMsg('Completa todos los campos')
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const data = await res.json()
    if (!res.ok) return showMsg(data.error)
    localStorage.setItem('token', data.token)
    showMsg('¡Login exitoso! Redirigiendo...', true)
    setTimeout(() => { window.location.href = '/dashboard' }, 1200)
  } catch {
    showMsg('Error de conexión con el servidor')
  } finally {
    loading.value = false
  }
}

async function register() {
  if (!email.value || !password.value) return showMsg('Completa todos los campos')
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const data = await res.json()
    if (!res.ok) return showMsg(data.error)
    showMsg('¡Cuenta creada! Ahora inicia sesión.', true)
    mode.value = 'login'
  } catch {
    showMsg('Error de conexión con el servidor')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

/* NAVBAR */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 56px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-left { display: flex; align-items: center; gap: 8px; }
.logo-text { font-size: 1.1rem; font-weight: 700; color: #0052CC; }
.navbar-right { display: flex; align-items: center; gap: 1.2rem; }

.nav-item { position: relative; }
.nav-link {
  color: #172b4d;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.15s;
}
.nav-link:hover { color: #0052CC; }

.dropdown {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px 20px;
  min-width: 220px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 200;
}
.dropdown-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #8993a4;
  margin-bottom: 10px;
}
.dropdown ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.dropdown ul li { font-size: 0.88rem; color: #172b4d; }

.btn-nav-login {
  background: none; border: none; color: #172b4d;
  font-size: 0.9rem; font-weight: 500; cursor: pointer;
  padding: 6px 12px; border-radius: 4px;
  transition: background 0.15s; font-family: 'Inter', sans-serif;
}
.btn-nav-login:hover { background: #f1f2f4; }
.btn-nav-register {
  background: #0052CC; color: white; border: none;
  padding: 8px 16px; border-radius: 4px;
  font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: background 0.15s; font-family: 'Inter', sans-serif;
}
.btn-nav-register:hover { background: #0747a6; }

/* HERO */
.hero {
  display: flex; align-items: center; justify-content: center;
  gap: 4rem; min-height: calc(100vh - 56px);
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #e6f0ff 0%, #f0f4ff 50%, #e8f5e9 100%);
}
.hero-content { flex: 1; max-width: 480px; }
.hero-title {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 800; color: #172b4d;
  line-height: 1.2; margin-bottom: 1rem;
}
.hero-sub { font-size: 1rem; color: #44546f; margin-bottom: 2rem; line-height: 1.6; }

/* FORM */
.form-wrapper {
  background: white; border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  overflow: hidden; max-width: 420px;
}
.tabs { display: flex; border-bottom: 1px solid #e2e8f0; }
.tab {
  flex: 1; padding: 14px; background: none; border: none;
  font-size: 0.9rem; font-weight: 600; color: #44546f;
  cursor: pointer; border-bottom: 2px solid transparent;
  transition: all 0.15s; font-family: 'Inter', sans-serif;
}
.tab.active { color: #0052CC; border-bottom-color: #0052CC; background: #f7f9ff; }
.form-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 12px; }
.form-input {
  width: 100%; padding: 10px 14px;
  border: 1.5px solid #dfe1e6; border-radius: 6px;
  font-size: 0.95rem; color: #172b4d;
  outline: none; transition: border-color 0.15s;
  font-family: 'Inter', sans-serif;
}
.form-input:focus { border-color: #0052CC; }
.btn-primary {
  width: 100%; padding: 11px; background: #0052CC;
  color: white; border: none; border-radius: 6px;
  font-size: 0.95rem; font-weight: 700; cursor: pointer;
  transition: background 0.15s; margin-top: 4px;
  font-family: 'Inter', sans-serif;
}
.btn-primary:hover:not(:disabled) { background: #0747a6; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.mensaje { font-size: 0.875rem; padding: 8px 12px; border-radius: 6px; text-align: center; }
.mensaje.ok { background: #e3fcef; color: #006644; }
.mensaje.error { background: #ffebe6; color: #bf2600; }
.terms { font-size: 0.75rem; color: #8993a4; text-align: center; line-height: 1.5; }
.terms a { color: #0052CC; text-decoration: none; }

/* BOARD PREVIEW */
.hero-visual { flex: 1; max-width: 480px; display: flex; justify-content: center; }
.board-preview {
  display: flex; gap: 12px;
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(8px);
  border-radius: 16px; padding: 20px;
  box-shadow: 0 8px 32px rgba(0,82,204,0.12);
}
.board-col {
  width: 140px; background: #f1f2f4;
  border-radius: 10px; padding: 10px;
  display: flex; flex-direction: column; gap: 8px;
}
.board-col-title {
  font-size: 0.78rem; font-weight: 700; color: #44546f;
  text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;
}
.board-card {
  background: white; border-radius: 6px; padding: 8px 10px;
  font-size: 0.82rem; color: #172b4d;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.board-card.highlight { border-left: 3px solid #0052CC; background: #f0f4ff; }
.board-card.done { opacity: 0.6; text-decoration: line-through; }

@media (max-width: 768px) {
  .hero { flex-direction: column; gap: 2rem; padding: 2rem 1rem; }
  .hero-visual { display: none; }
  .navbar-right .nav-link { display: none; }
  .btn-nav-login { display: none; }
}
</style>
