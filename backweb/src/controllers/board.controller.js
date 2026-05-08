const boardService = require('../services/board.service')

const getBoards = async (req, res) => {
  try {
    const boards = await boardService.getBoards(req.user.id)
    res.json(boards)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

const createBoard = async (req, res) => {
  try {
    const { name } = req.body
    if (!name?.trim()) return res.status(400).json({ error: 'Nombre requerido' })
    const board = await boardService.createBoard(req.user.id, name.trim())
    res.status(201).json(board)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

const deleteBoard = async (req, res) => {
  try {
    await boardService.deleteBoard(Number(req.params.id), req.user.id)
    res.json({ message: 'Tablero eliminado' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

const addColumn = async (req, res) => {
  try {
    const { label } = req.body
    if (!label?.trim()) return res.status(400).json({ error: 'Label requerido' })
    const col = await boardService.addColumn(Number(req.params.boardId), label.trim())
    res.status(201).json(col)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

const deleteColumn = async (req, res) => {
  try {
    await boardService.deleteColumn(Number(req.params.id))
    res.json({ message: 'Columna eliminada' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

const addCard = async (req, res) => {
  try {
    const { title } = req.body
    if (!title?.trim()) return res.status(400).json({ error: 'Título requerido' })
    const card = await boardService.addCard(Number(req.params.columnId), title.trim())
    res.status(201).json(card)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

const moveCard = async (req, res) => {
  try {
    const { columnId } = req.body
    if (!columnId) return res.status(400).json({ error: 'columnId requerido' })
    const card = await boardService.moveCard(Number(req.params.id), Number(columnId))
    res.json(card)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

const deleteCard = async (req, res) => {
  try {
    await boardService.deleteCard(Number(req.params.id))
    res.json({ message: 'Tarjeta eliminada' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

module.exports = { getBoards, createBoard, deleteBoard, addColumn, deleteColumn, addCard, moveCard, deleteCard }
