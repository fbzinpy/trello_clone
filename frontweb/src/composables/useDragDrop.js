import { ref } from 'vue'

export function useDragDrop(board) {
  const dragOverCol   = ref(null)
  const draggingCard  = ref(null)
  let   dragSnapshot  = null

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

  function onDrop(toCol) {
    const snap = dragSnapshot
    dragSnapshot = null

    if (!snap || !board) return
    if (snap.fromCol === toCol) { dragOverCol.value = null; return }

    const fromColObj = board.columns.find(c => c.key === snap.fromCol)
    const toColObj   = board.columns.find(c => c.key === toCol)
    if (!fromColObj || !toColObj) return

    const idx = fromColObj.cards.findIndex(c => c.id === snap.id)
    if (idx === -1) return

    const [card] = fromColObj.cards.splice(idx, 1)
    toColObj.cards.push(card)

    dragOverCol.value  = null
    draggingCard.value = null
  }

  return { dragOverCol, draggingCard, onDragStart, onDragEnd, onColLeave, onDrop }
}
