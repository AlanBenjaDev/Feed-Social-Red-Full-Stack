import express from 'express';
import pool from './db.js';  // importa tu conexión MySQL configurada
import multer from 'multer';
import  path  from 'path';
const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/verPublicaciones', async (req, res) => {
  try {
    const [publicaciones] = await pool.query(`
      SELECT id AS publicacion_id, usuario_id, contenido, img_url, created_at 
      FROM publicaciones
    `);

    const [comentarios] = await pool.query(`
      SELECT usuario_id, publicacion_id, texto, created_at 
      FROM comentarios
      ORDER BY created_at DESC
    `);

    const [likes] = await pool.query(`
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

// POST - Crear una publicación con imagen
router.post('/subirPublicacion', upload.single('imagen'), async (req, res) => {
  try {
    const { usuario_id, contenido } = req.body;
    
    // Validación mejorada
    if (!usuario_id || !contenido) {
      return res.status(400).json({ 
        error: 'Datos faltantes',
        detalles: {
          requeridos: ['usuario_id (número)', 'contenido (texto)'],
          opcional: ['imagen']
        }
      });
    }

    // Verificar que usuario_id sea número
    if (isNaN(Number(usuario_id))) {
      return res.status(400).json({ error: 'usuario_id debe ser un número' });
    }

    // Manejo flexible de la imagen
    let imgPath = null;
    if (req.file) {
      // Usar path.join para compatibilidad multiplataforma
      imgPath = path.join('uploads', req.file.filename);
      
      // Verificar que la extensión sea válida
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      
      if (!validExtensions.includes(fileExt)) {
        return res.status(400).json({ error: 'Formato de imagen no válido' });
      }
    }

    const [result] = await pool.query(
      'INSERT INTO publicaciones (usuario_id, contenido, img_url) VALUES (?, ?, ?)',
      [Number(usuario_id), contenido, imgPath]  // Aseguramos que usuario_id sea número
    );

    res.status(201).json({ 
      success: true,
      message: 'Publicación creada exitosamente',
      publicacion: {
        id: result.insertId,
        usuario_id,
        contenido,
        img_url: imgPath
      }
    });

  } catch (err) {
    console.error('Error al subir publicación:', err);
    
    // Manejo específico de errores de MySQL
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

router.delete('/borrarPublicacion', async (req, res) => {
  try {
    const { id, usuario_id } = req.body;

    if (!id || !usuario_id) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const userIdFromSession = req.session.usuario_id; // o desde JWT si usás tokens

    if (userIdFromSession !== usuario_id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta publicación' });
    }

    // Primero verificar si la publicación realmente pertenece al usuario
    const [publicacion] = await db.query('SELECT * FROM publicaciones WHERE id = ?', [id]);

    if (!publicacion || publicacion.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    if (publicacion[0].usuario_id !== usuario_id) {
      return res.status(403).json({ error: 'No puedes eliminar esta publicación' });
    }

    // Eliminar la publicación
    await db.query('DELETE FROM publicaciones WHERE id = ?', [id]);

    res.status(200).json({ message: 'Publicación eliminada con éxito' });

  } catch (error) {
    console.error('❌ Error al eliminar la publicación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})

router.put('/editarPublicacion', async (req, res) => {
  try {
    const { id, usuario_id, contenido } = req.body;

    if (!id || !usuario_id || !contenido) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
const userIdFromSession = req.session.usuario_id; // o token verificado

if (userIdFromSession !== usuario_id) {
  return res.status(403).json({ error: 'No tienes permiso para editar esta publicación' });
}

    const query = 'UPDATE publicaciones SET usuario_id = ?, contenido = ? WHERE id = ?';
    const params = [usuario_id, contenido, id];

    await db.query(query, params);

    res.status(200).json({ message: 'Publicación actualizada con éxito' });
  } catch (error) {
    console.error('Error al actualizar la publicación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;