<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-logo">
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
          <li class="nav-item active">Tableros</li>
          <li class="nav-item">Plantillas</li>
          <li class="nav-item">Inicio</li>
        </ul>

        <p class="menu-title">Espacios</p>
        <ul>
          <li class="nav-item">Mi espacio</li>
        </ul>
      </nav>
    </aside>

    <div class="main">
      <header class="header">
        <div class="search-wrapper">
          <input type="text" placeholder="Buscar..." class="search" />
        </div>
        <button class="btn-create">Crear</button>
        <div class="profile" @click="toggleMenu">
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

      <section class="content">
        <h3 class="section-title">Visto recientemente</h3>
        <div class="cards">
          <div v-for="board in recentBoards" :key="board.id" class="card" @click="openBoard(board)">
            {{ board.name }}
          </div>
        </div>

        <h3 class="section-title" style="margin-top: 32px;">Tus tableros</h3>
        <div class="cards">
          <div v-for="board in userBoards" :key="board.id" class="card" @click="openBoard(board)">
            {{ board.name }}
          </div>
          <div class="card add" @click="createBoard">+ Crear nuevo</div>
        </div>
      </section>
    </div>

    <!-- MODAL TABLERO -->
    <div v-if="selectedBoard" class="modal-overlay" @click.self="closeBoard">
      <div class="modal">
        <div class="modal-header">
          <div>
            <h2 class="modal-title">{{ selectedBoard.name }}</h2>
            <p class="modal-subtitle">Arrastra las tarjetas entre columnas</p>
          </div>
          <button class="modal-close" @click="closeBoard">✕</button>
        </div>

        <div class="modal-body">
          <div
            v-for="column in columns"
            :key="column.key"
            class="board-col"
            :class="{ 'drag-over': dragOverCol === column.key }"
            @dragover.prevent="dragOverCol = column.key"
            @dragleave="onColLeave(column.key)"
            @drop="onDrop(column.key)"
          >
            <div class="board-col-top">
              <div class="board-col-title">{{ column.label }}</div>
              <span class="board-count">{{ selectedBoard.columns[column.key].length }}</span>
            </div>

            <div class="board-card-list">
              <div
                v-for="card in selectedBoard.columns[column.key]"
                :key="card.id"
                class="board-card"
                :class="{ 'dragging': draggingCard?.id === card.id }"
                draggable="true"
                @dragstart="onDragStart(card, column.key)"
                @dragend="onDragEnd"
              >
                <p class="board-card-text">{{ card.title }}</p>
                <button class="delete-card" @click="deleteCard(column.key, card.id)" title="Eliminar">✕</button>
              </div>

              <!-- Placeholder mientras arrastra sobre la columna -->
              <div
                v-if="dragOverCol === column.key && draggingCard && draggingCard.fromCol !== column.key"
                class="drop-placeholder"
              />
            </div>

            <div class="add-card-box">
              <input
                v-model="newCards[column.key]"
                type="text"
                class="add-card-input"
                :placeholder="`Agregar a ${column.label}...`"
                @keyup.enter="addCard(column.key)"
              />
              <button class="add-card-btn" @click="addCard(column.key)">+ Agregar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
const open = ref(false)
const selectedBoard = ref(null)

const columns = [
  { key: 'todo',  label: 'Por hacer'   },
  { key: 'doing', label: 'En progreso' },
  { key: 'done',  label: 'Listo'       },
]

const newCards   = ref({ todo: '', doing: '', done: '' })
const dragOverCol  = ref(null)
const draggingCard = ref(null) // { id, fromCol }

let nextBoardId = 10
let nextCardId  = 100

/* ── Auth ── */
function decodeToken(token) {
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return {} }
}
const tokenData    = computed(() => auth.token ? decodeToken(auth.token) : {})
const userEmail    = computed(() => tokenData.value.email || 'usuario@trelloclone.com')
const userInitials = computed(() => userEmail.value.slice(0, 3).toUpperCase())

/* ── Boards ── */
function makeBoard(id, name) {
  return {
    id, name,
    columns: {
      todo:  [
        { id: nextCardId++, title: 'Diseñar pantalla login' },
        { id: nextCardId++, title: 'Conectar con API' },
      ],
      doing: [
        { id: nextCardId++, title: 'Crear base de datos' },
        { id: nextCardId++, title: 'Setup del proyecto' },
      ],
      done:  [
        { id: nextCardId++, title: 'Instalar dependencias' },
      ],
    },
  }
}

const recentBoards = ref([makeBoard(1,'Proyecto 1'), makeBoard(2,'Proyecto 2'), makeBoard(3,'Proyecto 3')])
const userBoards   = ref([makeBoard(4,'Tablero A'),  makeBoard(5,'Tablero B'),  makeBoard(6,'Tablero C')])

function toggleMenu() { open.value = !open.value }
function logout()     { auth.logout(); location.href = '/' }

function createBoard() {
  const name = prompt('Nombre del nuevo tablero:')
  if (!name?.trim()) return
  userBoards.value.push({ id: nextBoardId++, name: name.trim(), columns: { todo: [], doing: [], done: [] } })
}

function openBoard(board)  { selectedBoard.value = board }
function closeBoard()      { selectedBoard.value = null  }

/* ── Cards ── */
function addCard(col) {
  const text = newCards.value[col].trim()
  if (!text || !selectedBoard.value) return
  selectedBoard.value.columns[col].push({ id: nextCardId++, title: text })
  newCards.value[col] = ''
}

function deleteCard(col, cardId) {
  if (!selectedBoard.value) return
  selectedBoard.value.columns[col] = selectedBoard.value.columns[col].filter(c => c.id !== cardId)
}

/* ── Drag & Drop ── */
function onDragStart(card, fromCol) {
  draggingCard.value = { ...card, fromCol }
}

function onDragEnd() {
  dragOverCol.value  = null
  draggingCard.value = null
}

function onColLeave(colKey) {
  if (dragOverCol.value === colKey) dragOverCol.value = null
}

function onDrop(toCol) {
  if (!draggingCard.value || !selectedBoard.value) return

  const { id, fromCol } = draggingCard.value
  if (fromCol === toCol) { dragOverCol.value = null; return }

  const fromList = selectedBoard.value.columns[fromCol]
  const idx = fromList.findIndex(c => c.id === id)
  if (idx === -1) return

  const [card] = fromList.splice(idx, 1)
  selectedBoard.value.columns[toCol].push(card)

  dragOverCol.value  = null
  draggingCard.value = null
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

.layout { display: flex; height: 100vh; background: #f0f4ff; }

/* SIDEBAR */
.sidebar { width: 240px; background: white; border-right: 1px solid #e2e8f0; padding: 20px 16px; flex-shrink: 0; }
.sidebar-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; padding: 4px 8px; }
.logo { font-size: 1rem; font-weight: 700; color: #0052CC; }
.menu-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: #8993a4; margin: 16px 8px 6px; }
ul { list-style: none; }
.nav-item { padding: 10px 12px; border-radius: 6px; cursor: pointer; font-size: .9rem; font-weight: 500; color: #44546f; transition: .15s; }
.nav-item:hover, .nav-item.active { background: #f0f4ff; color: #0052CC; }

/* MAIN */
.main { flex: 1; display: flex; flex-direction: column; background: linear-gradient(135deg,#e6f0ff 0%,#f0f4ff 60%,#e8f5e9 100%); overflow-y: auto; }

/* HEADER */
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
.dropdown-item:hover { background: #f0f4ff; color: #0052CC; }
.logout:hover { background: #ffebe6; color: #bf2600; }

/* CONTENT */
.content { padding: 28px 32px; }
.section-title { font-size: 1rem; font-weight: 700; color: #172b4d; margin-bottom: 14px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 200px)); gap: 16px; }
.card { height: 110px; background: linear-gradient(135deg,#6366f1 0%,#0052CC 50%,#22c55e 100%); border-radius: 10px; padding: 12px 14px; cursor: pointer; display: flex; align-items: flex-end; font-size: .92rem; font-weight: 700; color: white; box-shadow: 0 2px 8px rgba(0,82,204,.18); transition: .15s; }
.card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,82,204,.22); }
.add { background: white; border: 1.5px solid #e2e8f0; color: #44546f; justify-content: center; align-items: center; box-shadow: none; }
.add:hover { background: #f0f4ff; border-color: #0052CC; color: #0052CC; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(23,43,77,.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 999; }
.modal { width: min(1100px, 100%); max-height: 90vh; overflow: auto; background: #f7f9ff; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #e2e8f0; background: white; position: sticky; top: 0; z-index: 5; }
.modal-title { font-size: 1.1rem; color: #172b4d; font-weight: 700; }
.modal-subtitle { font-size: .82rem; color: #8993a4; margin-top: 3px; }
.modal-close { border: none; background: #f1f2f4; color: #44546f; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; font-size: 1rem; }
.modal-close:hover { background: #e2e8f0; }

/* BOARD */
.modal-body { display: flex; gap: 16px; padding: 20px; align-items: flex-start; overflow-x: auto; }

.board-col {
  flex: 1;
  min-width: 260px;
  background: rgba(255,255,255,.7);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 12px;
  transition: border-color .15s, background .15s;
}

.board-col.drag-over {
  border-color: #0052CC;
  background: #eef3ff;
}

.board-col-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.board-col-title { font-size: .78rem; font-weight: 700; color: #44546f; text-transform: uppercase; letter-spacing: .5px; }
.board-count { background: #f0f4ff; color: #0052CC; border-radius: 999px; padding: 2px 8px; font-size: .75rem; font-weight: 700; }

.board-card-list { display: flex; flex-direction: column; gap: 10px; min-height: 80px; margin-bottom: 12px; }

.board-card {
  background: white;
  border-radius: 8px;
  padding: 10px 10px 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
  border: 1px solid #e2e8f0;
  cursor: grab;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  transition: box-shadow .15s, opacity .15s, transform .15s;
  user-select: none;
}

.board-card:hover { box-shadow: 0 4px 12px rgba(0,82,204,.14); }

.board-card.dragging {
  opacity: .45;
  transform: scale(.97);
  cursor: grabbing;
}

.board-card-text { font-size: .86rem; color: #172b4d; line-height: 1.4; flex: 1; }

.delete-card {
  border: none;
  background: none;
  color: #c2c7d0;
  font-size: .8rem;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  flex-shrink: 0;
  transition: color .15s;
}
.delete-card:hover { color: #bf2600; }

/* Drop placeholder */
.drop-placeholder {
  height: 54px;
  border-radius: 8px;
  border: 2px dashed #0052CC;
  background: #eef3ff;
  opacity: .6;
}

/* ADD CARD */
.add-card-box { display: flex; flex-direction: column; gap: 8px; }
.add-card-input { width: 100%; padding: 9px 12px; border: 1.5px solid #dfe1e6; border-radius: 6px; font-size: .9rem; color: #172b4d; outline: none; background: white; }
.add-card-input:focus { border-color: #0052CC; }
.add-card-btn { background: #0052CC; color: white; border: none; border-radius: 6px; padding: 9px 12px; font-size: .88rem; font-weight: 600; cursor: pointer; }
.add-card-btn:hover { background: #0747a6; }

@media (max-width: 900px) {
  .sidebar { display: none; }
  .content { padding: 20px 16px; }
  .modal-body { flex-direction: column; }
  .board-col { min-width: 100%; }
}
</style>