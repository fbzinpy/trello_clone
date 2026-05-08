const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validate')
const { registerSchema, loginSchema } = require('../schemas')

// Rutas públicas
router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)

// Ruta protegida: solo usuarios autenticados
router.get('/me', verifyToken, authController.getMe)

// Ruta protegida: solo administradores
router.get('/admin/users', verifyToken, authorizeRoles('admin'), authController.getAllUsers)

module.exports = router
