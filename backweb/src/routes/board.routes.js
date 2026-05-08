const express = require('express')
const router = express.Router()
const c = require('../controllers/board.controller')
const { verifyToken } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validate')
const { createBoardSchema, addColumnSchema, addCardSchema, moveCardSchema } = require('../schemas')

// Todas las rutas de tableros requieren autenticacion
router.use(verifyToken)

// Tableros
router.get('/', c.getBoards)
router.post('/', validate(createBoardSchema), c.createBoard)
router.delete('/:id', c.deleteBoard)

// Columnas
router.post('/:boardId/columns', validate(addColumnSchema), c.addColumn)
router.delete('/columns/:id', c.deleteColumn)

// Tarjetas
router.post('/columns/:columnId/cards', validate(addCardSchema), c.addCard)
router.patch('/cards/:id/move', validate(moveCardSchema), c.moveCard)
router.delete('/cards/:id', c.deleteCard)

module.exports = router
