
import pool from './db.js';
const router = express.Router();
import express from 'express';





router.post('/enviar', async (req, res) => {
  try {
    const { usuario_id, publicacion_id, comentario } = req.body;

    if (
      typeof usuario_id === 'undefined' ||
      typeof publicacion_id === 'undefined' ||
      typeof comentario === 'undefined'
    ) {
      return res.status(400).json({
        error: 'Faltan campos requeridos',
        campos_recibidos: Object.keys(req.body),
      });
    }

    if (isNaN(Number(usuario_id)) || isNaN(Number(publicacion_id))) {
      return res.status(400).json({
        error: 'IDs inválidos',
        detalles: { usuario_id, publicacion_id },
      });
    }

    if (typeof comentario !== 'string' || comentario.trim() === '') {
      return res.status(400).json({ error: 'Texto de comentario inválido' });
    }

    if (comentario.length > 500) {
      return res.status(400).json({ error: 'Comentario demasiado largo' });
    }

    console.log('Datos recibidos:', req.body);

    const query = `
      INSERT INTO comentarios (texto, publicacion_id, usuario_id)
      VALUES (?, ?, ?)
    `
    const values = [comentario.trim(), Number(publicacion_id), Number(usuario_id)];

    const [result] = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Comentario subido con éxito',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Error en el POST /enviar:', err);

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        error: 'Usuario o publicación no existe',
        detalles: {
          usuario_id: req.body.usuario_id,
          publicacion_id: req.body.publicacion_id,
        },
      });
    }

    res.status(500).json({
      error: 'Error en la base de datos',
      detalles: err.message,
    });
  }
});
router.get('/likes', (req, res) => {
  const query = 'SELECT usuario_id, publicacion_id FROM likes';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta:', err);
      return res.status(500).json({ error: 'Error al contar los likes' });
    }
    res.json(results);
  });
});
router.post('/dar', async (req, res) => {
  try {
    // 🔍 DEBUG: Mostrar todo el cuerpo recibido
    console.log('BODY recibido en /dar:', req.body);

    // ✅ Extraer datos del cuerpo
    const { usuario_id, publicacion_id } = req.body;

    // 🛑 Validación: campos faltantes
    if (
      typeof usuario_id === 'undefined' ||
      typeof publicacion_id === 'undefined'
    ) {
      return res.status(400).json({
        error: 'Faltan campos requeridos',
        campos_recibidos: Object.keys(req.body),
        cuerpo: req.body
      });
    }

    // 🛑 Validación: deben ser números
    if (isNaN(Number(usuario_id)) || isNaN(Number(publicacion_id))) {
      return res.status(400).json({
        error: 'IDs inválidos',
        detalles: { usuario_id, publicacion_id },
      });
    }

    // ✅ DEBUG: Datos recibidos
    console.log('Datos validados:', { usuario_id, publicacion_id });

    // ✅ Consulta SQL corregida (solo 2 valores)
    const query = `
      INSERT INTO likes (publicacion_id, usuario_id)
      VALUES (?, ?)
    `;

    const values = [Number(publicacion_id), Number(usuario_id)];

    const [result] = await pool.query(query, values);

    // ✅ Respuesta OK
    res.status(201).json({
      success: true,
      message: 'Like subido con éxito',
      id: result.insertId,
    });

  } catch (err) {
    console.error('❌ Error en el POST /dar:', err);

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        error: 'Usuario o publicación no existe',
        detalles: {
          usuario_id: req.body.usuario_id,
          publicacion_id: req.body.publicacion_id,
        },
      });
    }

    res.status(500).json({
      error: 'Error en la base de datos',
      detalles: err.message,
    });
  }
});
export default router;