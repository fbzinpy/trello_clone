const { z } = require('zod')

const registerSchema = z.object({
  email: z
    .string({ required_error: 'El correo es obligatorio' })
    .email('Correo inválido'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

const loginSchema = z.object({
  email: z
    .string({ required_error: 'El correo es obligatorio' })
    .email('Correo inválido'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña es obligatoria')
})

const createBoardSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del tablero es obligatorio' })
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no puede superar 100 caracteres')
})

const addColumnSchema = z.object({
  label: z
    .string({ required_error: 'El nombre de la columna es obligatorio' })
    .min(1, 'El nombre no puede estar vacío')
    .max(60, 'El nombre no puede superar 60 caracteres')
})

const addCardSchema = z.object({
  title: z
    .string({ required_error: 'El título de la tarjeta es obligatorio' })
    .min(1, 'El título no puede estar vacío')
    .max(200, 'El título no puede superar 200 caracteres')
})

const moveCardSchema = z.object({
  columnId: z
    .number({ required_error: 'columnId es obligatorio', invalid_type_error: 'columnId debe ser un número' })
    .int('columnId debe ser entero')
    .positive('columnId debe ser positivo')
})

module.exports = { registerSchema, loginSchema, createBoardSchema, addColumnSchema, addCardSchema, moveCardSchema }
