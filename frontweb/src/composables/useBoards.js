import { ref } from 'vue'

let nextBoardId = 10
let nextColKey  = 1
let nextCardId  = 100

function makeKey()  { return `col_${nextColKey++}` }

function makeCol(label, cards = []) {
  return { key: makeKey(), label, cards }
}

function makeBoard(id, name) {
  return {
    id,
    name,
    columns: [
      makeCol('Por hacer', [
        { id: nextCardId++, title: 'Diseñar pantalla login' },
        { id: nextCardId++, title: 'Conectar con API' },
      ]),
      makeCol('En progreso', [
        { id: nextCardId++, title: 'Crear base de datos' },
        { id: nextCardId++, title: 'Setup del proyecto' },
      ]),
      makeCol('Listo', [
        { id: nextCardId++, title: 'Instalar dependencias' },
      ]),
    ],
  }
}

export function useBoards() {
  const recentBoards = ref([
    makeBoard(1, 'Proyecto 1'),
    makeBoard(2, 'Proyecto 2'),
    makeBoard(3, 'Proyecto 3'),
  ])

  const userBoards = ref([
    makeBoard(4, 'Tablero A'),
    makeBoard(5, 'Tablero B'),
    makeBoard(6, 'Tablero C'),
  ])

  function createBoard() {
    const name = prompt('Nombre del nuevo tablero:')
    if (!name?.trim()) return
    userBoards.value.push({
      id: nextBoardId++,
      name: name.trim(),
      columns: [
        makeCol('Por hacer'),
        makeCol('En progreso'),
        makeCol('Listo'),
      ],
    })
  }

  return { recentBoards, userBoards, createBoard }
}
