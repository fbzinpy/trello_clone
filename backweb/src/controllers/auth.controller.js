const authService = require('../services/auth.service')

const register = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Datos incompletos' })
    }

    const result = await authService.register(email, password)
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Error al registrar usuario' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const result = await authService.login(email, password)
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: error.message || 'Error en login' })
  }
}

// Devuelve los datos del usuario autenticado (desde req.user seteado por verifyToken)
const getMe = (req, res) => {
  res.json({ user: req.user })
}

// Solo accesible por admin
const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

module.exports = { register, login, getMe, getAllUsers }
