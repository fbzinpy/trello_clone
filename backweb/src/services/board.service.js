const prisma = require('../prisma')

const getBoards = (userId) =>
  prisma.board.findMany({
    where: { userId },
    include: {
      columns: {
        include: { cards: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

const createBoard = (userId, name) =>
  prisma.board.create({
    data: {
      name,
      userId,
      columns: {
        create: [
          { label: 'Por hacer', order: 0 },
          { label: 'En progreso', order: 1 },
          { label: 'Listo', order: 2 }
        ]
      }
    },
    include: {
      columns: {
        include: { cards: true },
        orderBy: { order: 'asc' }
      }
    }
  })

const deleteBoard = (id, userId) =>
  prisma.board.deleteMany({ where: { id, userId } })

const addColumn = (boardId, label) =>
  prisma.column.create({
    data: { boardId, label },
    include: { cards: true }
  })

const deleteColumn = (id) =>
  prisma.column.delete({ where: { id } })

const addCard = (columnId, title) =>
  prisma.card.create({ data: { columnId, title } })

const moveCard = (cardId, columnId) =>
  prisma.card.update({
    where: { id: cardId },
    data: { columnId }
  })

const deleteCard = (id) =>
  prisma.card.delete({ where: { id } })

module.exports = { getBoards, createBoard, deleteBoard, addColumn, deleteColumn, addCard, moveCard, deleteCard }
