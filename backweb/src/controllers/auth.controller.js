const authService = require('../services/auth.service')

const register = async (req, res) => {
  try {
    const { email, password, birthDate } = req.body

    if (!email || !password || !birthDate) {
      return res.status(400).json({ error: 'Datos incompletos' })
    }

    // Calcular edad
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--

    // Menores de 16 → bloqueados
    if (age < 16) {
      return res.status(403).json({ error: 'Debes tener al menos 16 años para registrarte' })
    }

    // Entre 16 y 17 años → no se guarda en BD
    if (age >= 16 && age < 18) {
      return res.status(200).json({
        minor_accepted: true,
        message: 'Registro recibido, pero tu cuenta no será guardada por ser menor de 18 años.'
      })
    }

    // Mayor o igual a 18 → flujo normal
    const result = await authService.register(email, password, birthDate)
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
