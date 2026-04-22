const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth.routes')

const app = express()

app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)

// SERVER
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000')
})

module.exports = app
