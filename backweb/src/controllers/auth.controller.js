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

module.exports = { register, login }
