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
        role: 'user', // 👈 IMPORTANTE
      },
    });

    res.json({ message: 'Usuario creado' });

  } catch (error) {
    console.error(error); // 👈 para ver el error real
    res.status(400).json({ error: 'Error al registrar usuario' });
  }
});