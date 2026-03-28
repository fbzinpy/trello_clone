<template>
  <div class="container">
    <div class="card">
      <h1 class="title">Dashboard </h1>
      <p class="subtitle">Si ves esto, estás logueado</p>

      <div class="actions">
        <button class="logout" @click="logout">
          Cerrar sesión 
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()

const logout = () => {
  auth.logout()
  location.href = '/'
}
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  font-family: popins, sans-serif;
}

.card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 20px;
  width: 340px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.title {
  margin-bottom: 0.5rem;
  color: #111827;
}

.subtitle {
  margin-bottom: 2rem;
  color: #6b7280;
  font-size: 0.95rem;
}

.actions {
  display: flex;
  justify-content: center;
}

.logout {
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: #ef4444;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.logout:hover {
  background: #dc2626;
  transform: translateY(-1px);
}
</style>