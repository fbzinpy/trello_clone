<template>
  <div class="layout">
    <AppSidebar />
    <div class="main">
      <AppHeader />
      <section class="content">
        <BoardGrid
          title="Visto recientemente"
          :boards="recentBoards"
          @open="openBoard"
        />
        <BoardGrid
          title="Tus tableros"
          :boards="userBoards"
          :show-add="true"
          style="margin-top: 32px"
          @open="openBoard"
          @create="createBoard"
        />
      </section>
    </div>
    <BoardModal
      v-if="selectedBoard"
      :board="selectedBoard"
      @close="selectedBoard = null"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import AppHeader from '../components/AppHeader.vue'
import BoardGrid from '../components/BoardGrid.vue'
import BoardModal from '../components/BoardModal.vue'
import { useBoards } from '../composables/useBoards'

const { recentBoards, userBoards, createBoard } = useBoards()
const selectedBoard = ref(null)

function openBoard(board) {
  selectedBoard.value = board
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.layout { display: flex; height: 100vh; background: #f0f4ff; }
.main { flex: 1; display: flex; flex-direction: column; background: linear-gradient(135deg,#e6f0ff 0%,#f0f4ff 60%,#e8f5e9 100%); overflow-y: auto; }
.content { padding: 28px 32px; }
@media (max-width: 900px) { .content { padding: 20px 16px; } }
</style>
