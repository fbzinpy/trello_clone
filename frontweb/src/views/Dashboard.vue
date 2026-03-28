<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>Dashboard</h1>
        <p>Bienvenido, ya estás dentro</p>
      </div>

      <div class="content">
        <div class="info">
          <p class="label">Estado</p>
          <p class="value">Autenticado</p>
        </div>

        <div class="info">
          <p class="label">Sesión</p>
          <p class="value">Activa </p>
        </div>
      </div>

      <button class="logout" @click="logout">
        Cerrar sesión
      </button>
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
  background: radial-gradient(circle at top, #1e293b, #020617);
  font-family: 'Poppins', sans-serif;
}

/* TARJETA */
.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 20px;
  width: 360px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  text-align: center;
  animation: fadeIn 0.6s ease;
}

/* HEADER */
.header h1 {
  margin-bottom: 0.3rem;
  color: #0f172a;
}

.header p {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* INFO */
.content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.info {
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 12px;
  width: 48%;
}

.label {
  font-size: 0.75rem;
  color: #64748b;
}

.value {
  font-weight: bold;
  color: #0f172a;
}

/* BOTÓN */
.logout {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(220, 38, 38, 0.3);
}

/* ANIMACIÓN */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:global(body) {
  margin: 0 !important;
  display: block !important;
}

:global(#app) {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  border: none !important;
  display: block !important;
}

.container {
  width: 100%;
  max-width: none;
}

</style>