import { ref } from 'vue'
import api from '../axios'

export function useDragDrop(board) {
  const dragOverCol  = ref(null)
  const draggingCard = ref(null)
  let   dragSnapshot = null

  function onDragStart({ card, colKey }, nativeEvent) {
    draggingCard.value = { ...card, fromCol: colKey }
    dragSnapshot       = { ...card, fromCol: colKey }
    if (nativeEvent?.dataTransfer) {
      nativeEvent.dataTransfer.effectAllowed = 'move'
    }
  }

  function onDragEnd() {
    draggingCard.value = null
    dragOverCol.value  = null
  }

  function onColLeave(colKey) {
    if (dragOverCol.value === colKey) dragOverCol.value = null
  }

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
