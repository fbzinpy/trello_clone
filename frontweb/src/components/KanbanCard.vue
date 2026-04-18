<template>
  <div
    class="board-card"
    :class="{ dragging: isDragging }"
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
    @dragend="$emit('dragend')"
  >
    <textarea
      v-if="editing"
      class="card-edit-input"
      v-model="card.title"
      rows="2"
      autofocus
      @blur="editing = false"
      @keyup.enter.exact.prevent="editing = false"
      @keyup.escape="editing = false"
    />
    <p
      v-else
      class="board-card-text"
      @dblclick="editing = true"
      title="Doble click para editar"
    >{{ card.title }}</p>
    <button class="delete-card" @click="$emit('delete')" title="Eliminar">✕</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  card:       { type: Object,  required: true },
  isDragging: { type: Boolean, default: false }
})
defineEmits(['dragstart', 'dragend', 'delete'])

const editing = ref(false)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.board-card { background: white; border-radius: 8px; padding: 10px 10px 8px; box-shadow: 0 1px 4px rgba(0,0,0,.08); border: 1px solid #e2e8f0; cursor: grab; display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; transition: box-shadow .15s, opacity .15s, transform .15s; user-select: none; }
.board-card:hover { box-shadow: 0 4px 12px rgba(0,82,204,.14); }
.board-card.dragging { opacity: .45; transform: scale(.97); cursor: grabbing; }
.board-card-text { font-size: .86rem; color: #172b4d; line-height: 1.4; flex: 1; }
.card-edit-input { flex: 1; font-size: .86rem; color: #172b4d; line-height: 1.4; border: 1.5px solid #0052CC; border-radius: 4px; padding: 4px 6px; outline: none; resize: none; font-family: 'Inter', sans-serif; }
.delete-card { border: none; background: none; color: #c2c7d0; font-size: .8rem; cursor: pointer; padding: 0 2px; line-height: 1; flex-shrink: 0; transition: color .15s; }
.delete-card:hover { color: #bf2600; }
</style>
