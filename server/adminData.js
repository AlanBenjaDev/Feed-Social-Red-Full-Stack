import express from 'express';
import pool from './db.js'
const router = express.Router();
const saltRounds = 10;
router.get('/dashboard', async (req, res) => {
  try {
    const [usuarios] = await pool.query('SELECT * FROM usuarios');
    const [productos] = await pool.query('SELECT * FROM productos');
    res.json({ usuarios, productos });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});
export default router;