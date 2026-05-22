<template>
  <div class="layout">
    <!-- Sidebar controla que seccion se ve; el estado vive aqui en Dashboard. -->
    <AppSidebar
      :selected-section="selectedSection"
      @select-section="selectedSection = $event"
    />
    <div class="main">
      <!-- v-model:search equivale a pasar :search y escuchar update:search. -->
      <AppHeader v-model:search="search" @create-board="openCreateBoardModal" />
      <section class="content">
        <!-- Vista especial: plantillas no vienen del backend, son datos locales. -->
        <div v-if="selectedSection === 'plantillas'" class="templates-view">
          <div class="section-head">
            <h2 class="page-title">Plantillas</h2>
            <p class="page-subtitle">Crea un tablero base con una estructura lista para usar.</p>
          </div>
          <BoardGrid
            title="Plantillas sugeridas"
            :boards="filteredTemplates"
            @open="useTemplate"
          />
        </div>

        <template v-else>
          <div class="section-head">
            <h2 class="page-title">{{ sectionTitle }}</h2>
            <p class="page-subtitle">{{ sectionSubtitle }}</p>
          </div>
          <!-- Tableros recientes: se muestran en Inicio y Tableros. -->
          <BoardGrid
            v-if="showRecentBoards"
            title="Visto recientemente"
            :boards="filteredRecentBoards"
            @open="openBoard"
          />
          <!-- Tableros del usuario: permite crear, duplicar y eliminar. -->
          <BoardGrid
            v-if="showUserBoards"
            title="Tus tableros"
            :boards="filteredUserBoards"
            :show-add="true"
            :show-menu="true"
            style="margin-top: 32px"
            @open="openBoard"
            @create="openCreateBoardModal"
            @duplicate-board="handleDuplicateBoard"
            @delete-board="handleDeleteBoard"
          />
        </template>
      </section>
    </div>
    <!-- Modal Kanban: aparece solo cuando hay un tablero seleccionado. -->
    <BoardModal
      v-if="selectedBoard"
      :board="selectedBoard"
      @close="selectedBoard = null"
    />
    <!-- Modal de creacion: se abre desde header o desde la tarjeta "+ Crear nuevo". -->
    <CreateBoardModal
      v-if="showCreateBoardModal"
      @close="closeCreateBoardModal"
      @create="handleCreateBoard"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import AppHeader from '../components/AppHeader.vue'
import BoardGrid from '../components/BoardGrid.vue'
import BoardModal from '../components/BoardModal.vue'
import CreateBoardModal from '../components/CreateBoardModal.vue'
import { useBoards } from '../composables/useBoards'

// useBoards concentra las llamadas API y devuelve listas reactivas.
const { recentBoards, userBoards, createBoard, duplicateBoard, deleteBoard } = useBoards()

// Estado de pantalla: modal abierto, busqueda y seccion activa.
const selectedBoard = ref(null)
const showCreateBoardModal = ref(false)
const search = ref('')
const selectedSection = ref('tableros')

// Plantillas fake: funcionan como atajos para crear tableros con nombre base.
const templates = ref([
  { id: 'tpl-1', name: 'Sprint semanal' },
  { id: 'tpl-2', name: 'Roadmap de producto' },
  { id: 'tpl-3', name: 'Seguimiento de bugs' }
])

// Computed = valores derivados. Se recalculan cuando cambia search o las listas.
const filteredRecentBoards = computed(() => filterBoards(recentBoards.value, search.value))
const filteredUserBoards = computed(() => filterBoards(userBoards.value, search.value))
const filteredTemplates = computed(() => filterBoards(templates.value, search.value))

const showRecentBoards = computed(() => ['tableros', 'inicio'].includes(selectedSection.value))
const showUserBoards = computed(() => ['tableros', 'mi-espacio'].includes(selectedSection.value))

// Titulo y subtitulo dependen de la seccion seleccionada en el sidebar.
const sectionTitle = computed(() => {
  if (selectedSection.value === 'inicio') return 'Inicio'
  if (selectedSection.value === 'mi-espacio') return 'Mi espacio'
  return 'Tableros'
})

const sectionSubtitle = computed(() => {
  if (selectedSection.value === 'inicio') return 'Accede rápido a lo que abriste recientemente.'
  if (selectedSection.value === 'mi-espacio') return 'Administra los tableros que te pertenecen.'
  return 'Consulta tus tableros recientes y crea nuevos espacios de trabajo.'
})

// Filtro reutilizable para recientes, usuario y plantillas.
function filterBoards(boards, term) {
  const normalizedTerm = term.trim().toLowerCase()

  if (!normalizedTerm) {
    return boards
  }

  return boards.filter((board) => board.name.toLowerCase().includes(normalizedTerm))
}

// Abrir tablero significa guardar el objeto en selectedBoard; eso muestra BoardModal.
function openBoard(board) {
  selectedBoard.value = board
}

function openCreateBoardModal() {
  showCreateBoardModal.value = true
}

function closeCreateBoardModal() {
  showCreateBoardModal.value = false
}

// Crea tablero y lleva al usuario a "Mi espacio" para verlo en la lista.
function handleCreateBoard(name) {
  createBoard(name)
  selectedSection.value = 'mi-espacio'
  closeCreateBoardModal()
}

// Usa una plantilla creando un tablero nuevo con el nombre de la plantilla.
function useTemplate(template) {
  createBoard(`${template.name} copia`)
  selectedSection.value = 'mi-espacio'
}

// Duplicar en este frontend reutiliza createBoard con "copia".
function handleDuplicateBoard(board) {
  duplicateBoard(board)
  selectedSection.value = 'mi-espacio'
}

// Si se elimina el tablero que esta abierto, tambien cierra el modal.
function handleDeleteBoard(board) {
  deleteBoard(board.id)

  if (selectedBoard.value?.id === board.id) {
    selectedBoard.value = null
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.layout { display: flex; height: 100vh; background: #f0f4ff; }
.main { flex: 1; display: flex; flex-direction: column; background: linear-gradient(135deg,#e6f0ff 0%,#f0f4ff 60%,#e8f5e9 100%); overflow-y: auto; }
.content { padding: 28px 32px; }
.section-head { margin-bottom: 20px; }
.page-title { font-size: 1.35rem; font-weight: 800; color: #172b4d; }
.page-subtitle { margin-top: 6px; color: #52627a; font-size: 0.95rem; }
:global(.dark-mode) .layout { background: #0f172a; }
:global(.dark-mode) .main { background: linear-gradient(135deg,#101827 0%,#172033 56%,#10251f 100%); }
:global(.dark-mode) .content { background: transparent; color: #dbeafe; min-height: calc(100vh - 58px); }
:global(.dark-mode) .page-title { color: #f8fafc; }
:global(.dark-mode) .page-subtitle { color: #9fb0c8; }
@media (max-width: 900px) { .content { padding: 20px 16px; } }
</style>
