import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  password: 'juanma1723',
  host: 'localhost',
  port: 5432,
  database: 'bingo',
})

export const dbQuery = async(text, params) =>{
  try {
    const res = await pool.query(text, params); 
    return res;  
  } catch (error) {
    console.error('Error en la consulta SQL:', error.message);
    throw new Error('Error en la base de datos');  
  }
} 
