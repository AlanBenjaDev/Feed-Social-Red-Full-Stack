import pool from './db.js';
const router = express.Router();
import express from 'express';

router.get('/api/perfiles', (req, res) => {
  const query = 'SELECT usuario_id, img_url, seguidores, created_at FROM perfiles';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta:', err);
      return res.status(500).json({ error: 'Error al visualizar perfiles' });
    }
    res.json(results);
  });
});
router.put('/api/perfiles', async (req, res) => {
  try {
    const { id, usuario_id, img_url } = req.body;

    if (!id || !usuario_id || !img_url) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const userIdFromSession = req.session.usuario_id; // o token verificado

    if (userIdFromSession !== usuario_id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este perfil' });
    }

    const query = 'UPDATE perfiles SET img_url = ? WHERE id = ? AND usuario_id = ?';
    const params = [img_url, id, usuario_id];

    await pool.query(query, params);

    res.status(200).json({ message: 'Perfil actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
export default router;