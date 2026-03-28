<template>
  <div>
    <h2>Login</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Entrar</button>
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