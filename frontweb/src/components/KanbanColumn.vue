<template>
  <div
    class="board-col"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="$emit('dragover')"
    @dragleave.self="$emit('dragleave')"
    @drop.prevent="$emit('drop')"
  >
    <!-- Cabecera columna -->
    <div class="board-col-top">
      <input
        v-if="editingTitle"
        class="col-title-input"
        v-model="col.label"
        @blur="editingTitle = false"
        @keyup.enter="editingTitle = false"
        @keyup.escape="editingTitle = false"
        autofocus
      />
      <div
        v-else
        class="board-col-title"
        @dblclick="editingTitle = true"
        title="Doble click para renombrar"
      >{{ col.label }}</div>
      <div class="col-top-actions">
        <span class="board-count">{{ col.cards.length }}</span>
        <button class="delete-col-btn" @click="$emit('delete-col', col.key)" title="Eliminar columna">✕</button>
      </div>
    </div>

    <!-- Tarjetas -->
    <div class="board-card-list">
      <KanbanCard
        v-for="card in col.cards"
        :key="card.id"
        :card="card"
        :is-dragging="draggingCard?.id === card.id"
        @dragstart="$emit('dragstart', { card, colKey: col.key })"
        @dragend="$emit('dragend')"
        @delete="$emit('delete-card', { colKey: col.key, cardId: card.id })"
      />
      <div
        v-if="isDragOver && draggingCard && draggingCard.fromCol !== col.key"
        class="drop-placeholder"
      />
    </div>

    <!-- Agregar tarjeta -->
    <div class="add-card-box">
      <input
        v-model="newCardText"
        type="text"
        class="add-card-input"
        :placeholder="`Agregar a ${col.label}...`"
        @keyup.enter="submitCard"
      />
      <button class="add-card-btn" @click="submitCard">+ Agregar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import KanbanCard from './KanbanCard.vue'

const props = defineProps({
  col:          { type: Object,  required: true },
  isDragOver:   { type: Boolean, default: false },
  draggingCard: { type: Object,  default: null  }
})

const emit = defineEmits([
  'dragover', 'dragleave', 'drop',
  'dragstart', 'dragend',
  'add-card', 'delete-card', 'delete-col'
])

const editingTitle = ref(false)
const newCardText  = ref('')

function submitCard() {
  const text = newCardText.value.trim()
  if (!text) return
  emit('add-card', { colKey: props.col.key, text })
  newCardText.value = ''
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.board-col { flex: 1; min-width: 260px; background: rgba(255,255,255,.7); border: 2px solid transparent; border-radius: 12px; padding: 12px; transition: border-color .15s, background .15s; }
.board-col.drag-over { border-color: #0052CC; background: #eef3ff; }
.board-col-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.board-col-title { font-size: .78rem; font-weight: 700; color: #44546f; text-transform: uppercase; letter-spacing: .5px; cursor: pointer; }
.col-title-input { font-size: .78rem; font-weight: 700; color: #44546f; text-transform: uppercase; letter-spacing: .5px; border: 1.5px solid #0052CC; border-radius: 4px; padding: 2px 6px; outline: none; width: 100%; }
.col-top-actions { display: flex; align-items: center; gap: 6px; }
.board-count { background: #f0f4ff; color: #0052CC; border-radius: 999px; padding: 2px 8px; font-size: .75rem; font-weight: 700; }
.delete-col-btn { border: none; background: none; color: #c2c7d0; font-size: .8rem; cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: color .15s, background .15s; }
.delete-col-btn:hover { color: #bf2600; background: #ffebe6; }
.board-card-list { display: flex; flex-direction: column; gap: 10px; min-height: 80px; margin-bottom: 12px; }
.drop-placeholder { height: 54px; border-radius: 8px; border: 2px dashed #0052CC; background: #eef3ff; opacity: .6; }
.add-card-box { display: flex; flex-direction: column; gap: 8px; }
.add-card-input { width: 100%; padding: 9px 12px; border: 1.5px solid #dfe1e6; border-radius: 6px; font-size: .9rem; color: #172b4d; outline: none; background: white; }
.add-card-input:focus { border-color: #0052CC; }
.add-card-btn { background: #0052CC; color: white; border: none; border-radius: 6px; padding: 9px 12px; font-size: .88rem; font-weight: 600; cursor: pointer; }
.add-card-btn:hover { background: #0747a6; }
@media (max-width: 900px) { .board-col { min-width: 100%; } }
</style>
