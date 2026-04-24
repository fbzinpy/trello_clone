<template>
  <div>
    <h3 class="section-title">{{ title }}</h3>
    <div class="cards">
      <div
        v-for="board in boards"
        :key="board.id"
        class="card"
        @click="$emit('open', board)"
      >
        <button
          v-if="showMenu"
          class="card-menu-trigger"
          type="button"
          @click.stop="toggleMenu(board.id)"
        >
          ...
        </button>
        <div
          v-if="showMenu && openMenuId === board.id"
          class="card-menu"
          @click.stop
        >
          <button class="card-menu-item" type="button" @click="duplicateBoard(board)">
            Duplicar tablero
          </button>
          <button class="card-menu-item danger" type="button" @click="deleteBoard(board)">
            Eliminar tablero
          </button>
        </div>
        <span class="card-title">{{ board.name }}</span>
      </div>
      <div v-if="showAdd" class="card add" @click="$emit('create')">+ Crear nuevo</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  title:   { type: String, required: true },
  boards:  { type: Array,  required: true },
  showAdd: { type: Boolean, default: false },
  showMenu: { type: Boolean, default: false }
})

const emit = defineEmits(['open', 'create', 'duplicate-board', 'delete-board'])
const openMenuId = ref(null)

function toggleMenu(boardId) {
  openMenuId.value = openMenuId.value === boardId ? null : boardId
}

function closeMenu() {
  openMenuId.value = null
}

function duplicateBoard(board) {
  emit('duplicate-board', board)
  closeMenu()
}

function deleteBoard(board) {
  emit('delete-board', board)
  closeMenu()
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.section-title { font-size: 1rem; font-weight: 700; color: #172b4d; margin-bottom: 14px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 200px)); gap: 16px; }
.card { height: 110px; background: linear-gradient(135deg,#6366f1 0%,#0052CC 50%,#22c55e 100%); border-radius: 10px; padding: 12px 14px; cursor: pointer; display: flex; align-items: flex-end; font-size: .92rem; font-weight: 700; color: white; box-shadow: 0 2px 8px rgba(0,82,204,.18); transition: .15s; position: relative; overflow: visible; }
.card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,82,204,.22); }
.card-title { display: block; max-width: 100%; padding-right: 24px; }
.card-menu-trigger { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; border: none; border-radius: 50%; background: rgba(255,255,255,.18); color: white; font-size: 1rem; line-height: 1; cursor: pointer; }
.card-menu-trigger:hover { background: rgba(255,255,255,.28); }
.card-menu { position: absolute; top: 42px; right: 10px; width: 170px; background: white; border: 1px solid #d8e0ef; border-radius: 10px; box-shadow: 0 12px 24px rgba(15, 23, 42, .18); padding: 6px; z-index: 30; }
.card-menu-item { width: 100%; text-align: left; border: none; background: transparent; color: #172b4d; padding: 10px 12px; border-radius: 8px; font-size: .84rem; font-weight: 600; cursor: pointer; }
.card-menu-item:hover { background: #f0f4ff; color: #0052CC; }
.card-menu-item.danger:hover { background: #ffebe6; color: #bf2600; }
.add { background: white; border: 1.5px solid #e2e8f0; color: #44546f; justify-content: center; align-items: center; box-shadow: none; }
.add:hover { background: #f0f4ff; border-color: #0052CC; color: #0052CC; }
</style>
