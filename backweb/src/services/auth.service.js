const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../prisma')

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret'

class AuthError extends Error {
  constructor(message, statusCode = 400) {
    super(message)
    this.name = 'AuthError'
    this.statusCode = statusCode
  }
}

const register = async (email, password) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new AuthError('El usuario ya existe', 409)
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: 'user',
    },
  })

  return { message: 'Usuario creado' }
}

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new AuthError('Credenciales incorrectas', 401)
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    throw new AuthError('Credenciales incorrectas', 401)
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  return { token }
}

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true },
  })
}

module.exports = { register, login, getAllUsers }
