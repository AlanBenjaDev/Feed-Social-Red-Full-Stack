adminUsuario.js


import express from 'express';
import db from './db.js'; // ajustá según tu estructura
import bcrypt from 'bcrypt';





// Crear usuario
router.post('/admin/usuarios', async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const hash = await bcrypt.hash(password, saltRounds);

    await db.query(
      'INSERT INTO usuarios (role, email, password) VALUES (?, ?, ?)',
      [role, email, hash]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El usuario o email ya existe' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
});



// Eliminar usuario (por email)
router.delete('/admin/usuarios', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio para eliminar un usuario' });
    }

    const [result] = await db.query('DELETE FROM usuarios WHERE email = ?', [email]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (err) {
    console.error("❌ No se borró el usuario:", err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




router.put('/admin/usuarios', async (req, res) => {
  try {
    const { id, role, email, password } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Es necesario tener la id' });
    }
    if (!role || !email) {
      return res.status(400).json({ error: 'Es necesario tener todos los campos' });
    }

    let query = 'UPDATE usuarios SET role = ?, email = ?';
    const params = [role, email];

    if (password) {
      const hash = await bcrypt.hash(password, saltRounds);
      query += ', password = ?';
      params.push(hash);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
export default router;