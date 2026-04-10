const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs') 
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// REGISTER
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: 'user',
      },
    });

    res.json({ message: 'Usuario creado' });

  } catch (error) {
    console.error(error); 
    res.status(400).json({ error: 'Error al registrar usuario' });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuario no existe' });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ token: 'fake-token' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en login' });
  }
});

// SERVER
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000')
});