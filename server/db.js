// db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'N3x!9rT@qLz#7VpB', 
  database: 'lulu',  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true 
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado a la base de datos MySQL (red_social)');
    
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'red_social'
    `);
    
    console.log('📊 Tablas existentes:', tables.map(t => t.TABLE_NAME));
    connection.release();
  } catch (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
    process.exit(1);
  }
})();

export default pool;