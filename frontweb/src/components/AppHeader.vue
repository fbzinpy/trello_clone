<template>
  <header class="header">
    <div class="search-wrapper">
      <input
        :value="search"
        type="text"
        placeholder="Buscar tableros..."
        class="search"
        @input="updateSearch"
      />
    </div>
    <button class="btn-create" @click="$emit('create-board')">Crear</button>
    <div ref="profileRef" class="profile" @click="toggleMenu">
      {{ userInitials }}
      <div v-if="open" class="dropdown" @click.stop>
        <p class="email">{{ userEmail }}</p>
        <hr />
        <p class="dropdown-item">Perfil</p>
        <p class="dropdown-item">Configuración</p>
        <p class="dropdown-item logout" @click="logout">Cerrar sesión</p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const props = defineProps({
  search: { type: String, default: '' }
})

const emit = defineEmits(['update:search', 'create-board'])

const auth = useAuthStore()
const router = useRouter()
const open = ref(false)
const profileRef = ref(null)

function decodeToken(token) {
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return {} }
}

const tokenData    = computed(() => auth.token ? decodeToken(auth.token) : {})
const userEmail    = computed(() => tokenData.value.email || 'usuario@trelloclone.com')
const userInitials = computed(() => userEmail.value.slice(0, 3).toUpperCase())

function toggleMenu() { open.value = !open.value }

function updateSearch(event) {
  emit('update:search', event.target.value)
}

function handleClickOutside(event) {
  if (!profileRef.value?.contains(event.target)) {
    open.value = false
  }
}

function logout() {
  auth.logout()
  open.value = false
  router.push('/')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.header { height: 56px; background: white; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; gap: 12px; position: sticky; top: 0; z-index: 10; }
.search-wrapper { flex: 1; max-width: 280px; }
.search { width: 100%; padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: .88rem; color: #172b4d; outline: none; background: #f7f9ff; }
.search:focus { border-color: #0052CC; background: white; }
.btn-create { background: #0052CC; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-size: .88rem; font-weight: 600; cursor: pointer; }
.btn-create:hover { background: #0747a6; }
.profile { width: 36px; height: 36px; background: #f97316; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: .72rem; font-weight: 700; cursor: pointer; position: relative; flex-shrink: 0; }
.dropdown { position: absolute; top: calc(100% + 10px); right: 0; width: 230px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.12); z-index: 200; }
.email { font-size: .75rem; color: #8993a4; padding: 4px 8px 8px; word-break: break-all; }
hr { border: none; border-top: 1px solid #e2e8f0; margin: 4px 0; }
.dropdown-item { padding: 8px 10px; border-radius: 6px; cursor: pointer; font-size: .88rem; color: #172b4d; font-weight: 500; }
.dropdown-item:hover { background: #f0f4ff; color: #165ac0; }
.logout:hover { background: #ffebe6; color: #bf2600; }
</style>
