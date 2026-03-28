<template>
  <div>
    <h1>Dashboard 🔒</h1>
    <p>Si ves esto, estás logueado</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()

const logout = () => {
  auth.logout()
  location.href = '/'
}
</script>npm run dev