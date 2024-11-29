import { dbQuery } from "../db/db.js";


export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await dbQuery(query);
    //console.log('Tabla de usuarios creada o ya existe');
  } catch (error) {
    console.error('Error al crear la tabla:', error);
  }
}

export class User {

  constructor(id, username, email, password) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static async createUser(username, email, password) {
    try {
      const res = await dbQuery(
        'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id',
        [username, email, password]
      );
      return res.rows[0].id;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw new Error('Error al crear el usuario');
    }
  }
}