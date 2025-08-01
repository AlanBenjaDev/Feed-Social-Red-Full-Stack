import express from 'express';
import cors from 'cors';
import pool from './db.js';
import usuariosRouter from './usuarios.js';
import publicacionRouter from './publicacion.js';
import seguirSeguidosRouter from './seguirSeguidos.js';
import perfilesRouter from './perfiles.js';
import comentarioRouter from './comentario.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/usuarios', usuariosRouter);
app.use('/api/publicaciones', publicacionRouter);
app.use('/api/perfiles', perfilesRouter);
app.use('/api/seguir', seguirSeguidosRouter);
app.use('/api/comentario', comentarioRouter);


app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});