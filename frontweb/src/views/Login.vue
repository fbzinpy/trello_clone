<template>
  <div class="container">
    <div class="card">
      <h2 class="title">Bienvenido </h2>
      <p class="subtitle">Inicia sesión para continuar</p>

      <div class="form">
        <input 
          v-model="email" 
          type="email"
          placeholder="Correo electrónico" 
        />

        <input 
          v-model="password" 
          type="password" 
          placeholder="Contraseña" 
        />

        <button @click="login">
          Entrar 
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../axios'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')

const auth = useAuthStore()
const router = useRouter()

const login = async () => {
  try {
    const res = await api.post('/login', {
      email: email.value,
      password: password.value
    })

    auth.setToken(res.data.token)
    router.push('/dashboard')

  } catch (err) {
    alert('Error login')
  }
}
</script>

<style scoped>


.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  font-family: 'Poppins', sans-serif;
}

.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 20px;
  width: 320px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.title {
  margin-bottom: 0.3rem;
  color: #111827;
}

.subtitle {
  margin-bottom: 1.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  outline: none;
  transition: 0.2s;
}

input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

button {
  margin-top: 10px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background: #6366f1;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}
</style>