import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import api from '../axios'

// Composable = funcion reutilizable con estado y metodos.
// Aqui vive la logica de tableros para que Dashboard no tenga llamadas API directas.
export function useBoards() {
  const recentBoards = ref([])
  const userBoards = ref([])

  // Carga tableros del backend. El token se agrega automaticamente en axios.js.
  async function fetchBoards() {
    const auth = useAuthStore()
    if (!auth.token) return
    try {
      const { data } = await api.get('/boards')
      // El backend devuelve id numerico; el frontend agrega key string para v-for/drag.
      data.forEach(board => {
        board.columns = board.columns || []
        board.columns.forEach(col => { col.key = String(col.id) })
      })
      userBoards.value = data
      recentBoards.value = data.slice(0, 3)
    } catch (e) {
      console.error('Error al cargar tableros', e)
    }
  }

  // Crea tablero en backend y actualiza las listas reactivas.
  async function createBoard(name) {
    try {
      const { data } = await api.post('/boards', { name })
      data.columns = data.columns || []
      data.columns.forEach(col => { col.key = String(col.id) })
      userBoards.value.unshift(data)
      recentBoards.value = userBoards.value.slice(0, 3)
    } catch (e) {
      console.error('Error al crear tablero', e)
    }
  }

  // Borra en backend y recalcula recientes.
  async function deleteBoard(boardId) {
    try {
      await api.delete(`/boards/${boardId}`)
      userBoards.value = userBoards.value.filter((b) => b.id !== boardId)
      recentBoards.value = userBoards.value.slice(0, 3)
    } catch (e) {
      console.error('Error al eliminar tablero', e)
    }
  }

  // Duplicacion simple: crea un tablero nuevo con el mismo nombre + "copia".
  async function duplicateBoard(board) {
    await createBoard(`${board.name} copia`)
  }

  // Se ejecuta al usar el composable para llenar la pantalla automaticamente.
  fetchBoards()

  return { recentBoards, userBoards, createBoard, duplicateBoard, deleteBoard, fetchBoards }
}
