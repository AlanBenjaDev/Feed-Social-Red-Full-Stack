import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import db from './db.js';
import usuariosRouter from './usuarios.js';
import publicacionRouter from './publicacion.js';
import comentarioRouter from './comentario.js';

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
  origin: process.env.URLFRONTEND,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/usuarios', usuariosRouter);
app.use('/api/publicaciones', publicacionRouter);
app.use('/api/comentario', comentarioRouter);

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});