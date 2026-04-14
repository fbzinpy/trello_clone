<template>
  <div class="layout">
    <aside class="sidebar">
      <h2 class="logo">Trello Clone</h2>

      <nav>
        <p class="menu-title">General</p>
        <ul>
          <li>Tableros</li>
          <li>Plantillas</li>
          <li>Inicio</li>
        </ul>

        <p class="menu-title">Espacios</p>
        <ul>
          <li>Mi espacio</li>
        </ul>
      </nav>
    </aside>

    <div class="main">
      <header class="header">
        <input type="text" placeholder="Buscar..." class="search" />
        <button class="create">Crear</button>

        <div class="profile" @click="toggleMenu">
          FTP
          <div v-if="open" class="dropdown">
            <p class="email">fabiusc1855@gmail.com</p>
            <hr />
            <p class="item">Perfil</p>
            <p class="item">Configuración</p>
            <p class="item" @click="logout">Cerrar sesión</p>
          </div>
        </div>
      </header>

      <section class="content">
        <h3>Visto recientemente</h3>

        <div class="cards">
          <div class="card">Proyecto 1</div>
          <div class="card">Proyecto 2</div>
          <div class="card">Proyecto 3</div>
        </div>

        <h3 style="margin-top: 30px;">Tus tableros</h3>

        <div class="cards">
          <div class="card">Tablero A</div>
          <div class="card">Tablero B</div>
          <div class="card">Tablero C</div>
          <div class="card add">+ Crear nuevo</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
const open = ref(false)

const toggleMenu = () => {
  open.value = !open.value
}

const logout = () => {
  auth.logout()
  location.href = '/'
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.sidebar {
  width: 240px;
  background: #0f172a;
  color: white;
  padding: 20px;
}

.logo {
  margin-bottom: 20px;
}

.menu-title {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}

li:hover {
  background: #1e293b;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #020617;
  color: white;
}

.header {
  height: 60px;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.search {
  width: 250px;
  padding: 8px;
  border-radius: 6px;
  border: none;
}

.create {
  background: #3b82f6;
  border: none;
  padding: 8px 16px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.content {
  padding: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  gap: 16px;
  margin-top: 10px;
}

.card {
  height: 120px;
  background: linear-gradient(135deg, #6366f1, #22c55e);
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  font-weight: bold;
}

.card:hover {
  opacity: 0.9;
}

.add {
  background: #1e293b;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile {
  width: 35px;
  height: 35px;
  background: #f97316;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  position: relative;
}

.dropdown {
  position: absolute;
  top: 45px;
  right: 0;
  width: 220px;
  background: #1f2937;
  border-radius: 10px;
  padding: 10px;
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.email {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.item {
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}

.item:hover {
  background: #374151;
}

hr {
  border: none;
  border-top: 1px solid #374151;
  margin: 8px 0;
}
</style>