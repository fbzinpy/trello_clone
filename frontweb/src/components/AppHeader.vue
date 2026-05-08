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
    <div class="header-actions">
      <button
        :class="['theme-switch', { active: settings.darkMode }]"
        type="button"
        :aria-label="settings.darkMode ? 'Activar modo claro' : 'Activar modo oscuro'"
        :title="settings.darkMode ? 'Modo claro' : 'Modo oscuro'"
        @click="toggleDarkMode"
      >
        <span class="switch-thumb"></span>
      </button>
      <button class="btn-create" @click="$emit('create-board')">Crear</button>
    </div>
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
  emailUpdates: true,
  darkMode: false
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

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark-mode', isDark)
  document.body?.classList.toggle('dark-mode', isDark)
  document.getElementById('app')?.classList.toggle('dark-mode', isDark)
}

function toggleDarkMode() {
  settings.value = { ...settings.value, darkMode: !settings.value.darkMode }
  settingsDraft.value = { ...settings.value }
  localStorage.setItem('userSettings', JSON.stringify(settings.value))
  applyTheme(settings.value.darkMode)
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
  applyTheme(settings.value.darkMode)
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
  applyTheme(settings.value.darkMode)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.header { height: 58px; background: rgba(255,255,255,.92); border-bottom: 1px solid #dfe6f2; display: grid; grid-template-columns: minmax(210px, 340px) 1fr auto; align-items: center; padding: 0 18px 0 24px; gap: 14px; position: sticky; top: 0; z-index: 10; box-shadow: 0 8px 22px rgba(9,30,66,.06); backdrop-filter: blur(10px); transition: height .15s, padding .15s, background .15s, border-color .15s; }
.header.compact { height: 48px; padding: 0 14px 0 18px; }
.search-wrapper { width: 100%; }
.search { width: 100%; padding: 9px 13px; border: 1.5px solid #d8e0ef; border-radius: 8px; font-size: .88rem; color: #172b4d; outline: none; background: #f8faff; transition: border-color .15s, box-shadow .15s, background .15s; }
.search:focus { border-color: var(--user-accent, #0052CC); background: white; box-shadow: 0 0 0 3px rgba(0,82,204,.1); }
.header-actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
.theme-switch { width: 46px; height: 26px; border: 1px solid #d8e0ef; border-radius: 999px; background: #eef4ff; padding: 3px; display: flex; align-items: center; cursor: pointer; transition: background .2s, border-color .2s, box-shadow .2s; }
.theme-switch:hover { border-color: var(--user-accent, #0052CC); box-shadow: 0 4px 12px rgba(9,30,66,.1); }
.theme-switch.active { background: #172033; border-color: #334155; }
.switch-thumb { width: 18px; height: 18px; border-radius: 50%; background: white; box-shadow: 0 2px 6px rgba(9,30,66,.2); transform: translateX(0); transition: transform .2s, background .2s; position: relative; }
.switch-thumb::after { content: ''; position: absolute; inset: 5px; border-radius: 50%; background: #f59e0b; transition: background .2s, box-shadow .2s; }
.theme-switch.active .switch-thumb { transform: translateX(20px); background: #e5edf8; }
.theme-switch.active .switch-thumb::after { background: #172033; box-shadow: 4px 0 0 #e5edf8; }
.btn-create { background: var(--user-accent, #0052CC); color: white; border: none; padding: 9px 20px; border-radius: 8px; font-size: .88rem; font-weight: 700; cursor: pointer; box-shadow: 0 8px 16px rgba(0,82,204,.18); transition: filter .15s, transform .15s, box-shadow .15s; }
.btn-create:hover { filter: brightness(.92); transform: translateY(-1px); box-shadow: 0 10px 18px rgba(0,82,204,.22); }
.profile { width: 36px; height: 36px; background: #f97316; border: 2px solid rgba(255,255,255,.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: .72rem; font-weight: 800; cursor: pointer; position: relative; flex-shrink: 0; justify-self: end; box-shadow: 0 6px 14px rgba(249,115,22,.22); }
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
  .header { grid-template-columns: 1fr auto auto; padding: 0 12px; gap: 8px; }
  .search-wrapper { max-width: none; }
  .btn-create { padding: 9px 13px; }
  .modal-overlay { align-items: flex-end; padding: 12px; }
  .modal-actions { flex-direction: column-reverse; }
  .btn-secondary, .btn-primary { width: 100%; }
}

:global(.dark-mode),
:global(.dark-mode body),
:global(.dark-mode #app) { background: #0f172a; color: #dbeafe; }
:global(.dark-mode .layout) { background: #0f172a; }
:global(.dark-mode .main) { background: linear-gradient(135deg,#101827 0%,#172033 58%,#10251f 100%); }
:global(.dark-mode .content) { color: #dbeafe; }
:global(.dark-mode .sidebar) { background: #0f172a; border-right-color: #263449; }
:global(.dark-mode .logo) { color: #93c5fd; }
:global(.dark-mode .menu-title) { color: #718096; }
:global(.dark-mode .nav-item) { color: #cbd5e1; }
:global(.dark-mode .nav-item:hover),
:global(.dark-mode .nav-item.active) { background: #1f2d44; color: #93c5fd; }
:global(.dark-mode .page-title),
:global(.dark-mode .section-title) { color: #f8fafc; }
:global(.dark-mode .page-subtitle) { color: #9fb0c8; }
:global(.dark-mode .card) { box-shadow: 0 8px 18px rgba(0,0,0,.26); }
:global(.dark-mode .card.add) { background: #172033; border-color: #2b3a55; color: #cbd5e1; }
:global(.dark-mode .card.add:hover) { background: #1f2d44; border-color: var(--user-accent, #60a5fa); color: #f8fafc; }
:global(.dark-mode .card-menu) { background: #111c2e; border-color: #2b3a55; box-shadow: 0 14px 28px rgba(0,0,0,.34); }
:global(.dark-mode .card-menu-item) { color: #dbeafe; }
:global(.dark-mode .card-menu-item:hover) { background: #1f2d44; color: #f8fafc; }
:global(.dark-mode .card-menu-item.danger:hover) { background: rgba(191,38,0,.2); color: #fca5a5; }
:global(.dark-mode) .header { background: rgba(15,23,42,.92); border-bottom-color: #263449; box-shadow: 0 10px 24px rgba(0,0,0,.22); }
:global(.dark-mode) .search { background: #111c2e; border-color: #2b3a55; color: #e5edf8; }
:global(.dark-mode) .search::placeholder { color: #8291a8; }
:global(.dark-mode) .search:focus { background: #0f172a; box-shadow: 0 0 0 3px rgba(96,165,250,.16); }
:global(.dark-mode) .dropdown,
:global(.dark-mode) .modal { background: #111c2e; border-color: #2b3a55; color: #e5edf8; }
:global(.dark-mode) .modal-overlay { background: rgba(2,8,23,.64); }
:global(.dark-mode) .modal-header { background: #111c2e; border-bottom-color: #2b3a55; }
:global(.dark-mode) .modal-body { background: #0f172a; }
:global(.dark-mode) .profile-name,
:global(.dark-mode) .modal-title,
:global(.dark-mode) .summary-name,
:global(.dark-mode) .toggle-row strong,
:global(.dark-mode) .board-card-text,
:global(.dark-mode) .board-col-title { color: #f8fafc; }
:global(.dark-mode) .email,
:global(.dark-mode) .summary-email,
:global(.dark-mode) .toggle-row small,
:global(.dark-mode) .modal-subtitle { color: #9fb0c8; }
:global(.dark-mode) .dropdown-item { color: #dbeafe; }
:global(.dark-mode) .dropdown-item:hover { background: #1f2d44; color: #f8fafc; }
:global(.dark-mode) hr { border-top-color: #2b3a55; }
:global(.dark-mode) .profile-summary,
:global(.dark-mode) .toggle-row { background: #0f172a; border-color: #2b3a55; }
:global(.dark-mode) .input,
:global(.dark-mode) .add-card-input,
:global(.dark-mode) .add-col-input,
:global(.dark-mode) .card-edit-input,
:global(.dark-mode) .col-title-input { background: #0f172a; border-color: #2b3a55; color: #e5edf8; }
:global(.dark-mode) .input::placeholder,
:global(.dark-mode) .add-card-input::placeholder,
:global(.dark-mode) .add-col-input::placeholder { color: #8291a8; }
:global(.dark-mode) .modal-close,
:global(.dark-mode) .btn-secondary { background: #1f2d44; color: #dbeafe; }
:global(.dark-mode) .modal-close:hover,
:global(.dark-mode) .btn-secondary:hover { background: #2b3a55; }
:global(.dark-mode) .board-col,
:global(.dark-mode) .add-col-form { background: rgba(17,28,46,.86); border-color: #263449; }
:global(.dark-mode) .board-col.drag-over { background: #16243a; border-color: var(--user-accent, #60a5fa); }
:global(.dark-mode) .board-count { background: #1f2d44; color: #93c5fd; }
:global(.dark-mode) .board-card { background: #172033; border-color: #2b3a55; box-shadow: 0 4px 12px rgba(0,0,0,.22); }
:global(.dark-mode) .board-card:hover { box-shadow: 0 8px 18px rgba(0,0,0,.3); }
:global(.dark-mode) .drop-placeholder { background: #16243a; border-color: var(--user-accent, #60a5fa); }
:global(.dark-mode) .btn-cancel { background: #1f2d44; color: #dbeafe; }
:global(.dark-mode) .btn-cancel:hover { background: #2b3a55; }
:global(.dark-mode) .btn-add-col { background: rgba(17,28,46,.72); border-color: #334155; color: #cbd5e1; }
:global(.dark-mode) .btn-add-col:hover { background: #1f2d44; border-color: var(--user-accent, #60a5fa); color: #f8fafc; }
</style>
