<template>
  <aside class="sidebar">
    <div class="sidebar-logo" @click="emit('select-section', 'tableros')">
      <svg viewBox="0 0 24 24" fill="none" aria-label="Logo" width="28" height="28">
        <rect width="24" height="24" rx="4" fill="#0052CC"/>
        <rect x="4" y="5" width="6" height="10" rx="1.5" fill="white"/>
        <rect x="14" y="5" width="6" height="7" rx="1.5" fill="white"/>
      </svg>
      <h2 class="logo">Trello Clone</h2>
    </div>
    <nav>
      <p class="menu-title">General</p>
      <ul>
        <li
          :class="['nav-item', { active: selectedSection === 'tableros' }]"
          @click="emit('select-section', 'tableros')"
        >Tableros</li>
        <li
          :class="['nav-item', { active: selectedSection === 'plantillas' }]"
          @click="emit('select-section', 'plantillas')"
        >Plantillas</li>
        <li
          :class="['nav-item', { active: selectedSection === 'inicio' }]"
          @click="emit('select-section', 'inicio')"
        >Inicio</li>
      </ul>
      <p class="menu-title">Espacios</p>
      <ul>
        <li
          :class="['nav-item', { active: selectedSection === 'mi-espacio' }]"
          @click="emit('select-section', 'mi-espacio')"
        >Mi espacio</li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  selectedSection: { type: String, default: 'tableros' }
})

const emit = defineEmits(['select-section'])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.sidebar { width: 240px; background: white; border-right: 1px solid #e2e8f0; padding: 20px 16px; flex-shrink: 0; }
.sidebar-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; padding: 4px 8px; cursor: pointer; }
.logo { font-size: 1rem; font-weight: 700; color: #0052CC; }
.menu-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: #8993a4; margin: 16px 8px 6px; }
ul { list-style: none; }
.nav-item { padding: 10px 12px; border-radius: 6px; cursor: pointer; font-size: .9rem; font-weight: 500; color: #44546f; transition: .15s; }
.nav-item:hover, .nav-item.active { background: #f0f4ff; color: #0052CC; }
@media (max-width: 900px) { .sidebar { display: none; } }
</style>
