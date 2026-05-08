const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth.routes')
const boardRoutes = require('./routes/board.routes')

const app = express()

app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// SERVER
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000')
})

module.exports = app
