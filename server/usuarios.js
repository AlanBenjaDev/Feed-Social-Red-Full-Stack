import express from 'express';
import bcrypt from 'bcrypt';
import pool from './db.js';

const router = express.Router();
const saltRounds = 10;

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const hash = await bcrypt.hash(password, 10); // O usá `saltRounds`

    await pool.query(
      'INSERT INTO usuarios (role, email, password) VALUES (?, ?, ?)',
      ['user', email, hash]  // ← role fijo por defecto
    );

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    // Buscar usuario por email
    const [results] = await pool.query(
      'SELECT id, role, password FROM usuarios WHERE email = ?',
      [email]
    );

    if (!results || results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const userData = results[0];
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Quitar password para devolver info segura
    const { password: _, ...userSinPass } = userData;
    res.status(200).json({ message: 'Login exitoso', user: userSinPass });

  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


export default router;