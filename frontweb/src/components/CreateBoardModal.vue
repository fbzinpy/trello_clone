<template>
  <div class="modal-overlay" @click.self="close">
    <form class="modal" @submit.prevent="submit">
      <div class="modal-header">
        <div>
          <p class="modal-kicker">Nuevo espacio</p>
          <h2 class="modal-title">Crear tablero</h2>
        </div>
        <button class="modal-close" type="button" aria-label="Cerrar" @click="close">x</button>
      </div>

      <label class="field">
        <span>Nombre del tablero</span>
        <input
          ref="inputRef"
          v-model="boardName"
          class="input"
          type="text"
          placeholder="Ej. Proyecto web"
          maxlength="40"
        />
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="preview">
        <div class="preview-title">{{ previewName }}</div>
        <div class="preview-columns">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="actions">
        <button class="btn-secondary" type="button" @click="close">Cancelar</button>
        <button class="btn-primary" type="submit">Crear tablero</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'

const emit = defineEmits(['close', 'create'])

const boardName = ref('')
const error = ref('')
const inputRef = ref(null)

const previewName = computed(() => boardName.value.trim() || 'Nuevo tablero')

function close() {
  emit('close')
}

function submit() {
  const name = boardName.value.trim()

  if (!name) {
    error.value = 'Escribe un nombre para el tablero.'
    return
  }

  emit('create', name)
}

onMounted(async () => {
  await nextTick()
  inputRef.value?.focus()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.modal-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(23,43,77,.46); backdrop-filter: blur(5px); }
.modal { width: min(440px, 100%); background: white; border: 1px solid #d8e0ef; border-radius: 14px; box-shadow: 0 24px 70px rgba(9,30,66,.28); padding: 20px; color: #172b4d; }
.modal-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.modal-kicker { color: #0052CC; font-size: .75rem; font-weight: 800; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 4px; }
.modal-title { font-size: 1.35rem; font-weight: 800; line-height: 1.2; }
.modal-close { width: 34px; height: 34px; border: none; border-radius: 8px; background: #f1f2f4; color: #44546f; font-size: 1rem; font-weight: 700; cursor: pointer; }
.modal-close:hover { background: #e2e8f0; }
.field { display: flex; flex-direction: column; gap: 8px; color: #44546f; font-size: .86rem; font-weight: 700; }
.input { width: 100%; border: 1.5px solid #cfd7e6; border-radius: 8px; padding: 11px 12px; color: #172b4d; font-size: .95rem; outline: none; transition: border-color .15s, box-shadow .15s; }
.input:focus { border-color: #0052CC; box-shadow: 0 0 0 3px rgba(0,82,204,.12); }
.error { margin-top: 10px; border-radius: 8px; background: #ffebe6; color: #bf2600; padding: 9px 11px; font-size: .84rem; font-weight: 600; }
.preview { margin-top: 16px; min-height: 108px; border-radius: 12px; padding: 14px; background: linear-gradient(135deg,#6366f1 0%,#0052CC 52%,#22c55e 100%); box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); display: flex; flex-direction: column; justify-content: space-between; }
.preview-title { color: white; font-size: .95rem; font-weight: 800; overflow-wrap: anywhere; }
.preview-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.preview-columns span { height: 34px; border-radius: 8px; background: rgba(255,255,255,.72); }
.actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
.btn-secondary, .btn-primary { border: none; border-radius: 8px; padding: 10px 14px; font-size: .9rem; font-weight: 700; cursor: pointer; }
.btn-secondary { background: #f1f2f4; color: #44546f; }
.btn-secondary:hover { background: #e2e8f0; }
.btn-primary { background: #0052CC; color: white; }
.btn-primary:hover { background: #0747a6; }

@media (max-width: 520px) {
  .modal-overlay { align-items: flex-end; padding: 12px; }
  .modal { border-radius: 14px; }
  .actions { flex-direction: column-reverse; }
  .btn-secondary, .btn-primary { width: 100%; }
}
</style>
