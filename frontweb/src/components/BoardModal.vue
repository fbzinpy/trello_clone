<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div>
          <h2 class="modal-title">{{ board.name }}</h2>
          <p class="modal-subtitle">Arrastra las tarjetas entre columnas</p>
        </div>
        <button class="modal-close" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-body">
        <KanbanColumn
          v-for="col in board.columns"
          :key="col.key"
          :col="col"
          :is-drag-over="dragOverCol === col.key"
          :dragging-card="draggingCard"
          @dragover="dragOverCol = col.key"
          @dragleave="onColLeave(col.key)"
          @drop="onDrop(col.key)"
          @dragstart="onDragStart"
          @dragend="onDragEnd"
          @add-card="addCard"
          @delete-card="deleteCard"
          @delete-col="deleteColumn"
        />
        <!-- Agregar columna -->
        <div class="add-col-wrapper">
          <div v-if="addingColumn" class="add-col-form">
            <input
              v-model="newColLabel"
              class="add-col-input"
              placeholder="Nombre de la columna..."
              @keyup.enter="confirmAddColumn"
              @keyup.escape="cancelAddColumn"
              autofocus
            />
            <div class="add-col-actions">
              <button class="btn-confirm" @click="confirmAddColumn">Agregar</button>
              <button class="btn-cancel" @click="cancelAddColumn">Cancelar</button>
            </div>
          </div>
          <button v-else class="btn-add-col" @click="addingColumn = true">+ Agregar columna</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import KanbanColumn from './KanbanColumn.vue'
import { useDragDrop } from '../composables/useDragDrop'
import api from '../axios'

const props = defineProps({
  board: { type: Object, required: true }
})
defineEmits(['close'])

// Normalizar columnas: asegurar que tengan .key basado en .id
props.board.columns.forEach(col => {
  if (!col.key) col.key = String(col.id)
})

const { dragOverCol, draggingCard, onDragStart, onDragEnd, onColLeave, onDrop } = useDragDrop(props.board)

const addingColumn = ref(false)
const newColLabel  = ref('')

async function confirmAddColumn() {
  const label = newColLabel.value.trim()
  if (!label) return
  try {
    const { data } = await api.post(`/boards/${props.board.id}/columns`, { label })
    data.key = String(data.id)
    props.board.columns.push(data)
    newColLabel.value  = ''
    addingColumn.value = false
  } catch (e) {
    console.error('Error al agregar columna', e)
  }
}

function cancelAddColumn() {
  newColLabel.value  = ''
  addingColumn.value = false
}

async function deleteColumn(colKey) {
  const col = props.board.columns.find(c => c.key === colKey)
  if (!col) return
  try {
    await api.delete(`/boards/columns/${col.id}`)
    props.board.columns = props.board.columns.filter(c => c.key !== colKey)
  } catch (e) {
    console.error('Error al eliminar columna', e)
  }
}

async function addCard({ colKey, text }) {
  const col = props.board.columns.find(c => c.key === colKey)
  if (!col || !text.trim()) return
  try {
    const { data } = await api.post(`/boards/columns/${col.id}/cards`, { title: text.trim() })
    col.cards.push(data)
  } catch (e) {
    console.error('Error al agregar tarjeta', e)
  }
}

async function deleteCard({ colKey, cardId }) {
  const col = props.board.columns.find(c => c.key === colKey)
  if (!col) return
  try {
    await api.delete(`/boards/cards/${cardId}`)
    col.cards = col.cards.filter(c => c.id !== cardId)
  } catch (e) {
    console.error('Error al eliminar tarjeta', e)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.modal-overlay { position: fixed; inset: 0; background: rgba(23,43,77,.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 999; }
.modal { width: min(1200px,100%); max-height: 90vh; overflow: auto; background: #f7f9ff; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #e2e8f0; background: white; position: sticky; top: 0; z-index: 5; }
.modal-title { font-size: 1.1rem; color: #172b4d; font-weight: 700; }
.modal-subtitle { font-size: .82rem; color: #8993a4; margin-top: 3px; }
.modal-close { border: none; background: #f1f2f4; color: #44546f; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; font-size: 1rem; }
.modal-close:hover { background: #e2e8f0; }
.modal-body { display: flex; gap: 16px; padding: 20px; align-items: flex-start; overflow-x: auto; }
.add-col-wrapper { flex-shrink: 0; width: 260px; }
.add-col-form { background: rgba(255,255,255,.7); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.add-col-input { width: 100%; padding: 9px 12px; border: 1.5px solid #dfe1e6; border-radius: 6px; font-size: .9rem; color: #172b4d; outline: none; background: white; }
.add-col-input:focus { border-color: #0052CC; }
.add-col-actions { display: flex; gap: 8px; }
.btn-confirm { flex: 1; background: #0052CC; color: white; border: none; border-radius: 6px; padding: 8px; font-size: .88rem; font-weight: 600; cursor: pointer; }
.btn-confirm:hover { background: #0747a6; }
.btn-cancel { flex: 1; background: #f1f2f4; color: #44546f; border: none; border-radius: 6px; padding: 8px; font-size: .88rem; font-weight: 500; cursor: pointer; }
.btn-cancel:hover { background: #e2e8f0; }
.btn-add-col { width: 100%; padding: 12px; background: rgba(255,255,255,.5); border: 2px dashed #c1c7d0; border-radius: 12px; color: #44546f; font-size: .9rem; font-weight: 600; cursor: pointer; transition: .15s; }
.btn-add-col:hover { background: rgba(255,255,255,.8); border-color: #0052CC; color: #0052CC; }
@media (max-width: 900px) { .modal-body { flex-direction: column; } }
</style>
