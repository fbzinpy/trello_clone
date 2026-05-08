const express = require('express')
const router = express.Router()
const c = require('../controllers/board.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

// Todas las rutas de tableros requieren autenticacion
router.use(verifyToken)

// Tableros
router.get('/', c.getBoards)
router.post('/', c.createBoard)
router.delete('/:id', c.deleteBoard)

// Columnas
router.post('/:boardId/columns', c.addColumn)
router.delete('/columns/:id', c.deleteColumn)

// Tarjetas
router.post('/columns/:columnId/cards', c.addCard)
router.patch('/cards/:id/move', c.moveCard)
router.delete('/cards/:id', c.deleteCard)

module.exports = router
