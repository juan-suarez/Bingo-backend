import pg from 'pg';
import { createUsersTable } from '../model/userModel.js';
import { createBingoGameTable } from '../model/bingoGameModel.js';
import { createPlayersTable } from '../model/playerModel.js';
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
    throw error;  
  }
} 


export const initializeDb = async () => {
  try {
    await createUsersTable();
    await createBingoGameTable();
    await createPlayersTable();
    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};