<template>
  <header :class="['header', { compact: settings.compactMode }]">
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
        <p class="profile-name">{{ displayName }}</p>
        <p class="email">{{ userEmail }}</p>
        <hr />
        <button class="dropdown-item" type="button" @click="openPanel('profile')">Perfil</button>
        <button class="dropdown-item" type="button" @click="openPanel('settings')">Configuración</button>
        <button class="dropdown-item logout" type="button" @click="logout">Cerrar sesión</button>
      </div>
    </div>
  </header>

  <div v-if="activePanel === 'profile'" class="modal-overlay" @click.self="closePanel">
    <form class="modal" @submit.prevent="saveProfile">
      <div class="modal-header">
        <div>
          <p class="modal-kicker">Cuenta</p>
          <h2 class="modal-title">Perfil</h2>
        </div>
        <button class="modal-close" type="button" aria-label="Cerrar" @click="closePanel">x</button>
      </div>

      <div class="profile-summary">
        <div class="profile-avatar">{{ userInitials }}</div>
        <div>
          <p class="summary-name">{{ displayName }}</p>
          <p class="summary-email">{{ userEmail }}</p>
        </div>
      </div>

      <label class="field">
        <span>Nombre visible</span>
        <input v-model="profileDraft" class="input" type="text" maxlength="32" placeholder="Tu nombre" />
      </label>

      <div class="modal-actions">
        <button class="btn-secondary" type="button" @click="copyEmail">
          {{ copiedEmail ? 'Correo copiado' : 'Copiar correo' }}
        </button>
        <button class="btn-primary" type="submit">Guardar perfil</button>
      </div>
    </form>
  </div>

  <div v-if="activePanel === 'settings'" class="modal-overlay" @click.self="closePanel">
    <form class="modal" @submit.prevent="saveSettings">
      <div class="modal-header">
        <div>
          <p class="modal-kicker">Preferencias</p>
          <h2 class="modal-title">Configuración</h2>
        </div>
        <button class="modal-close" type="button" aria-label="Cerrar" @click="closePanel">x</button>
      </div>

      <label class="field">
        <span>Color principal</span>
        <select v-model="settingsDraft.accentColor" class="input">
          <option value="#0052CC">Azul Trello</option>
          <option value="#0f766e">Verde profundo</option>
          <option value="#7c3aed">Violeta</option>
          <option value="#c2410c">Naranja</option>
        </select>
      </label>

      <label class="toggle-row">
        <input v-model="settingsDraft.compactMode" type="checkbox" />
        <span>
          <strong>Modo compacto</strong>
          <small>Reduce la altura del encabezado para ver más contenido.</small>
        </span>
      </label>

      <label class="toggle-row">
        <input v-model="settingsDraft.emailUpdates" type="checkbox" />
        <span>
          <strong>Avisos de actividad</strong>
          <small>Guarda la preferencia para recordatorios dentro del tablero.</small>
        </span>
      </label>

      <p v-if="settingsSaved" class="success-msg">Configuración guardada.</p>

      <div class="modal-actions">
        <button class="btn-secondary" type="button" @click="resetSettings">Restablecer</button>
        <button class="btn-primary" type="submit">Guardar cambios</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

defineProps({
  search: { type: String, default: '' }
})

const emit = defineEmits(['update:search', 'create-board'])

const auth = useAuthStore()
const router = useRouter()
const open = ref(false)
const profileRef = ref(null)
const activePanel = ref(null)
const copiedEmail = ref(false)
const settingsSaved = ref(false)

const defaultSettings = {
  accentColor: '#0052CC',
  compactMode: false,
  emailUpdates: true
}

const profileName = ref(localStorage.getItem('profileName') || '')
const profileDraft = ref(profileName.value)
const settings = ref(loadSettings())
const settingsDraft = ref({ ...settings.value })

function decodeToken(token) {
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return {} }
}

const tokenData = computed(() => auth.token ? decodeToken(auth.token) : {})
const userEmail = computed(() => tokenData.value.email || 'usuario@trelloclone.com')
const displayName = computed(() => profileName.value || userEmail.value.split('@')[0])
const userInitials = computed(() => displayName.value.slice(0, 3).toUpperCase())

function toggleMenu() {
  open.value = !open.value
}

function updateSearch(event) {
  emit('update:search', event.target.value)
}

function handleClickOutside(event) {
  if (!profileRef.value?.contains(event.target)) {
    open.value = false
  }
}

function loadSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem('userSettings') || '{}') }
  } catch {
    return { ...defaultSettings }
  }
}

function applyAccentColor(color) {
  document.documentElement.style.setProperty('--user-accent', color)
}

function openPanel(panel) {
  activePanel.value = panel
  open.value = false
  copiedEmail.value = false
  settingsSaved.value = false
  profileDraft.value = profileName.value
  settingsDraft.value = { ...settings.value }
}

function closePanel() {
  activePanel.value = null
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(userEmail.value)
    copiedEmail.value = true
  } catch {
    copiedEmail.value = false
  }
}

function saveProfile() {
  profileName.value = profileDraft.value.trim()

  if (profileName.value) {
    localStorage.setItem('profileName', profileName.value)
  } else {
    localStorage.removeItem('profileName')
  }

  closePanel()
}

function saveSettings() {
  settings.value = { ...settingsDraft.value }
  localStorage.setItem('userSettings', JSON.stringify(settings.value))
  applyAccentColor(settings.value.accentColor)
  settingsSaved.value = true
}

function resetSettings() {
  settingsDraft.value = { ...defaultSettings }
  saveSettings()
}

function logout() {
  auth.logout()
  open.value = false
  activePanel.value = null
  router.push('/')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  applyAccentColor(settings.value.accentColor)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.header { height: 56px; background: white; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; gap: 12px; position: sticky; top: 0; z-index: 10; transition: height .15s, padding .15s; }
.header.compact { height: 46px; padding: 0 18px; }
.search-wrapper { flex: 1; max-width: 280px; }
.search { width: 100%; padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: .88rem; color: #172b4d; outline: none; background: #f7f9ff; }
.search:focus { border-color: var(--user-accent, #0052CC); background: white; }
.btn-create { background: var(--user-accent, #0052CC); color: white; border: none; padding: 8px 18px; border-radius: 6px; font-size: .88rem; font-weight: 600; cursor: pointer; }
.btn-create:hover { filter: brightness(.9); }
.profile { width: 36px; height: 36px; background: #f97316; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: .72rem; font-weight: 700; cursor: pointer; position: relative; flex-shrink: 0; }
.header.compact .profile { width: 32px; height: 32px; }
.dropdown { position: absolute; top: calc(100% + 10px); right: 0; width: 230px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.12); z-index: 200; }
.profile-name { font-size: .88rem; color: #172b4d; font-weight: 800; padding: 4px 8px 2px; word-break: break-word; }
.email { font-size: .75rem; color: #8993a4; padding: 0 8px 8px; word-break: break-all; }
hr { border: none; border-top: 1px solid #e2e8f0; margin: 4px 0; }
.dropdown-item { width: 100%; text-align: left; border: none; background: transparent; padding: 8px 10px; border-radius: 6px; cursor: pointer; font-size: .88rem; color: #172b4d; font-weight: 500; }
.dropdown-item:hover { background: #f0f4ff; color: #165ac0; }
.logout:hover { background: #ffebe6; color: #bf2600; }

.modal-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(23,43,77,.46); backdrop-filter: blur(5px); }
.modal { width: min(460px, 100%); background: white; border: 1px solid #d8e0ef; border-radius: 14px; box-shadow: 0 24px 70px rgba(9,30,66,.28); padding: 20px; color: #172b4d; }
.modal-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.modal-kicker { color: var(--user-accent, #0052CC); font-size: .75rem; font-weight: 800; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 4px; }
.modal-title { font-size: 1.35rem; font-weight: 800; line-height: 1.2; color: #172b4d; }
.modal-close { width: 34px; height: 34px; border: none; border-radius: 8px; background: #f1f2f4; color: #44546f; font-size: 1rem; font-weight: 700; cursor: pointer; }
.modal-close:hover { background: #e2e8f0; }
.profile-summary { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f7f9ff; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 16px; }
.profile-avatar { width: 44px; height: 44px; border-radius: 50%; background: #f97316; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: .82rem; flex-shrink: 0; }
.summary-name { color: #172b4d; font-weight: 800; font-size: .95rem; word-break: break-word; }
.summary-email { color: #6b778c; font-size: .82rem; margin-top: 2px; word-break: break-all; }
.field { display: flex; flex-direction: column; gap: 8px; color: #44546f; font-size: .86rem; font-weight: 700; margin-top: 14px; }
.input { width: 100%; border: 1.5px solid #cfd7e6; border-radius: 8px; padding: 11px 12px; color: #172b4d; font-size: .95rem; outline: none; background: white; transition: border-color .15s, box-shadow .15s; }
.input:focus { border-color: var(--user-accent, #0052CC); box-shadow: 0 0 0 3px rgba(0,82,204,.12); }
.toggle-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; margin-top: 12px; cursor: pointer; }
.toggle-row input { width: 18px; height: 18px; accent-color: var(--user-accent, #0052CC); margin-top: 2px; flex-shrink: 0; }
.toggle-row strong { display: block; color: #172b4d; font-size: .9rem; }
.toggle-row small { display: block; color: #6b778c; font-size: .78rem; line-height: 1.4; margin-top: 2px; }
.success-msg { margin-top: 12px; border-radius: 8px; background: #e3fcef; color: #006644; padding: 9px 11px; font-size: .84rem; font-weight: 700; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
.btn-secondary, .btn-primary { border: none; border-radius: 8px; padding: 10px 14px; font-size: .9rem; font-weight: 700; cursor: pointer; }
.btn-secondary { background: #f1f2f4; color: #44546f; }
.btn-secondary:hover { background: #e2e8f0; }
.btn-primary { background: var(--user-accent, #0052CC); color: white; }
.btn-primary:hover { filter: brightness(.9); }

@media (max-width: 560px) {
  .header { padding: 0 12px; }
  .search-wrapper { max-width: none; }
  .modal-overlay { align-items: flex-end; padding: 12px; }
  .modal-actions { flex-direction: column-reverse; }
  .btn-secondary, .btn-primary { width: 100%; }
}
</style>
