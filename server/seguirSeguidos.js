import pool from './db.js';
import express from 'express';
const router = express.Router();
router.post('/api/seguir', async (req, res) => {
  const { usuario_id, seguido_id } = req.body;

  if (!usuario_id || !seguido_id) {
    return res.status(400).json({ error: 'Faltan campos para seguir a un usuario.' });
  }

  if (usuario_id === seguido_id) {
    return res.status(400).json({ error: 'No puedes seguirte a ti mismo.' });
  }

  try {
    const query = `
      INSERT INTO seguir_usuario (usuario_id, seguido_id, created_at)
      VALUES (?, ?, NOW())
    `;
    const [result] = await pool.query(query, [usuario_id, seguido_id]);

    res.status(201).json({ message: 'Usuario seguido con éxito', id: result.insertId });
  } catch (err) {
    console.error('❌ Error al seguir usuario:', err);
    res.status(500).json({ error: 'Error interno al seguir usuario.' });
  }
});
router.delete('/api/seguir', async (req, res) => {
  const { usuario_id, seguido_id } = req.body;

  if (!usuario_id || !seguido_id) {
    return res.status(400).json({ error: 'Faltan campos para dejar de seguir' });
  }

  try {
    const [result] = await pool.query(
      'DELETE FROM seguir_usuario WHERE usuario_id = ? AND seguido_id = ?',
      [usuario_id, seguido_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Relación de seguimiento no encontrada' });
    }

    res.status(200).json({ message: 'Usuario dejado de seguir con éxito' });
  } catch (err) {
    console.error("❌ Error al dejar de seguir:", err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
router.get('/api/usuario/:id/seguidos', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`
      SELECT u.id, u.username, u.nombre
      FROM seguir_usuario s
      JOIN usuarios u ON s.seguido_id = u.id
      WHERE s.usuario_id = ?
    `, [id]);

    res.json(result);
  } catch (err) {
    console.error('❌ Error al obtener seguidos:', err);
    res.status(500).json({ error: 'Error al obtener usuarios seguidos' });
  }
});
router.get('/api/usuario/:id/seguidores', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`
      SELECT u.id, u.username, u.nombre
      FROM seguir_usuario s
      JOIN usuarios u ON s.usuario_id = u.id
      WHERE s.seguido_id = ?
    `, [id]);

    res.json(result);
  } catch (err) {
    console.error('❌ Error al obtener seguidores:', err);
    res.status(500).json({ error: 'Error al obtener seguidores' });
  }
});
export default router; 