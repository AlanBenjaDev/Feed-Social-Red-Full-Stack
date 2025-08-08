require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const db = require('./db');
const usuariosRouter = require('./usuarios.js');
const publicacionRouter = require('./publicacion.js');
const comentarioRouter = require('./comentario.js');

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
app.use('/api/comentario', comentarioRouter);

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});