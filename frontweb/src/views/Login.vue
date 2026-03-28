<template>
  <div class="container">
    <h1>Bienvenido</h1>
    <p>Inicia sesión para continuar</p>

    <input v-model="email" type="email" placeholder="Correo electrónico" />
    <input v-model="password" type="password" placeholder="Contraseña" />

    <button @click="login">Entrar</button>

    <p class="registro">
      ¿No tienes cuenta?
      <span @click="register">Regístrate</span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

//  LOGIN
async function login() {
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      return
    }

    // guardar token
    localStorage.setItem('token', data.token)

    alert('Login exitoso ')
    window.location.href = '/dashboard'

  } catch (error) {
    console.error(error)
  }
}

//  REGISTER
async function register() {
  try {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      return
    }

    alert('Usuario creado, ahora inicia sesión')

  } catch (error) {
    console.error(error)
  }
}
</script>

<style>
.container {
  max-width: 400px;
  margin: 100px auto;
  text-align: center;
}

input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
}

button {
  width: 100%;
  padding: 10px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
}

.registro {
  margin-top: 15px;
}

.registro span {
  color: #6366f1;
  cursor: pointer;
  font-weight: bold;
}
</style>