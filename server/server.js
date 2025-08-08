require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const db = require('./db');
const usuariosRouter = require('./usuarios');
const publicacionRouter = require('./publicacion');
const seguirSeguidosRouter = require('./seguirSeguidos');
const perfilesRouter = require('./perfiles');
const comentarioRouter = require('./comentario');

const app = express();
const port = process.env.PORT || 3000;

const conecction = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/usuarios', usuariosRouter);
app.use('/api/publicaciones', publicacionRouter);
app.use('/api/perfiles', perfilesRouter);
app.use('/api/seguir', seguirSeguidosRouter);
app.use('/api/comentario', comentarioRouter);

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});