import express from 'express';
import db from './db.js';
import upload from './upload.js';
const router = express.Router();

router.get('/verPublicaciones', async (req, res) => {
  try {
    const [publicaciones] = await db.query(`
      SELECT 
        p.id AS publicacion_id,
        p.usuario_id,
        u.user AS autor_publicacion,
        p.contenido,
        p.img_url,
        p.created_at
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.created_at DESC
    `);

    const [comentarios] = await db.query(`
      SELECT 
        c.usuario_id,
        u.user AS autor_comentario,
        c.publicacion_id,
        c.texto,
        c.created_at
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      ORDER BY c.created_at DESC
    `);

    const [likes] = await db.query(`
      SELECT usuario_id, publicacion_id 
      FROM likes
      ORDER BY created_at DESC
    `);

    const publicacionesConComentariosYLikes = publicaciones.map(publi => {
      const comentariosDePublicacion = comentarios.filter(c => c.publicacion_id === publi.publicacion_id);
      const likesDePublicacion = likes.filter(l => l.publicacion_id === publi.publicacion_id);

      return {
        ...publi,
        comentarios: comentariosDePublicacion,
        total_likes: likesDePublicacion.length,
      };
    });

    res.json(publicacionesConComentariosYLikes);
  } catch (err) {
    console.error('❌ Error al obtener publicaciones, comentarios o likes:', err);
    res.status(500).json({ error: 'Error al obtener publicaciones, comentarios o likes' });
  }
});

router.post('/subirPublicacion', upload.single('imagen'), async (req, res) => {
  try {
    const { usuario_id, contenido } = req.body;

    if (!usuario_id || !contenido) {
      return res.status(400).json({
        error: 'Datos faltantes',
        detalles: {
          requeridos: ['usuario_id (número)', 'contenido (texto)'],
          opcional: ['imagen']
        }
      });
    }

    if (isNaN(Number(usuario_id))) {
      return res.status(400).json({ error: 'usuario_id debe ser un número' });
    }

    const imagen = req.file?.path || null;

    const [result] = await db.query(
      'INSERT INTO publicaciones (usuario_id, contenido, img_url) VALUES (?, ?, ?)',
      [Number(usuario_id), contenido, imagen]
    );

    res.status(201).json({
      success: true,
      message: 'Publicación creada exitosamente',
      publicacion: {
        id: result.insertId,
        usuario_id,
        contenido,
        img_url: imagen
      }
    });
  } catch (err) {
    console.error('Error al subir publicación:', err);

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        error: 'El usuario no existe',
        usuario_id: req.body.usuario_id
      });
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
});

export default router;
