import { ref } from 'vue'
import api from '../axios'

export function useBoards() {
  const recentBoards = ref([])
  const userBoards = ref([])

  async function fetchBoards() {
    try {
      const { data } = await api.get('/boards')
      userBoards.value = data
      recentBoards.value = data.slice(0, 3)
    } catch (e) {
      console.error('Error al cargar tableros', e)
    }
  }

  async function createBoard(name) {
    try {
      const { data } = await api.post('/boards', { name })
      userBoards.value.unshift(data)
      recentBoards.value = userBoards.value.slice(0, 3)
    } catch (e) {
      console.error('Error al crear tablero', e)
    }
  }

  async function deleteBoard(boardId) {
    try {
      await api.delete(`/boards/${boardId}`)
      userBoards.value = userBoards.value.filter((b) => b.id !== boardId)
      recentBoards.value = userBoards.value.slice(0, 3)
    } catch (e) {
      console.error('Error al eliminar tablero', e)
    }
  }

  async function duplicateBoard(board) {
    await createBoard(`${board.name} copia`)
  }

  fetchBoards()

  return { recentBoards, userBoards, createBoard, duplicateBoard, deleteBoard }
}
