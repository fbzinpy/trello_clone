import { ref } from 'vue'
import api from '../axios'

// Maneja el drag/drop de tarjetas dentro de un tablero.
// Se separa del componente para que BoardModal sea mas facil de leer.
export function useDragDrop(board) {
  const dragOverCol  = ref(null)
  const draggingCard = ref(null)
  // Snapshot recuerda la tarjeta original aunque el evento drag cambie el estado visual.
  let   dragSnapshot = null

  // Guarda que tarjeta empezo a moverse y desde que columna salio.
  function onDragStart({ card, colKey }, nativeEvent) {
    draggingCard.value = { ...card, fromCol: colKey }
    dragSnapshot       = { ...card, fromCol: colKey }
    if (nativeEvent?.dataTransfer) {
      nativeEvent.dataTransfer.effectAllowed = 'move'
    }
  }

  // Limpia estado visual al terminar el drag.
  function onDragEnd() {
    draggingCard.value = null
    dragOverCol.value  = null
  }

  // Quita el resaltado si el mouse sale de la columna actual.
  function onColLeave(colKey) {
    if (dragOverCol.value === colKey) dragOverCol.value = null
  }

  // Drop:
  // 1. valida origen/destino
  // 2. mueve localmente para respuesta inmediata
  // 3. persiste el cambio con PATCH al backend
  // 4. revierte si la API falla
  async function onDrop(toCol) {
    const snap = dragSnapshot
    dragSnapshot = null

    if (!snap || !board) return
    if (snap.fromCol === toCol) { dragOverCol.value = null; return }

    const fromColObj = board.columns.find(c => c.id === snap.fromCol || c.key === snap.fromCol)
    const toColObj   = board.columns.find(c => c.id === toCol || c.key === toCol)
    if (!fromColObj || !toColObj) return

    const idx = fromColObj.cards.findIndex(c => c.id === snap.id)
    if (idx === -1) return

    // Mover localmente primero (UI instantanea)
    const [card] = fromColObj.cards.splice(idx, 1)
    toColObj.cards.push(card)

    dragOverCol.value  = null
    draggingCard.value = null

    // Persistir en la base de datos
    try {
      await api.patch(`/boards/cards/${card.id}/move`, { columnId: toColObj.id })
    } catch (e) {
      // Revertir si falla
      toColObj.cards.pop()
      fromColObj.cards.splice(idx, 0, card)
      console.error('Error al mover tarjeta', e)
    }
  }

  return { dragOverCol, draggingCard, onDragStart, onDragEnd, onColLeave, onDrop }
}
