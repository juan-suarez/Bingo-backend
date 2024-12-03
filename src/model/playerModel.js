import { dbQuery } from "../db/db.js";
import { BingoBoard } from "./bingoBoardModel.js";

export const createPlayersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      game_id INTEGER,
      status VARCHAR,
      board INTEGER[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (game_id) REFERENCES bingo_game(id)
    );
  `;

  try {
    await dbQuery(query);
  } catch (error) {
    console.error('Error al crear la tabla:', error);
  }
}

export class Player {
  #username;
  #board;
  #status;
  #gameId;
  #playerId;

  constructor(username, gameId) {
    this.#username = username;
    this.#gameId = gameId;
    this.#board = new BingoBoard();
    this.#status = "in lobby";
    this.savePlayerToDB();
  }

  async savePlayerToDB() {
    const query = `
      INSERT INTO players (username, game_id, status, board)
      VALUES ('${this.#username}', ${this.#gameId}, '${this.#status}', $1)
      RETURNING id;
    `;
    try {
      const result = await dbQuery(query, [this.#board.getBoard()]);
      this.#playerId = result.rows[0].id;
    } catch (error) {
      console.error('Error al guardar el jugador en la base de datos:', error);
    }
  }

  getUserName() {
    return this.#username;
  }

  getBoard() {
    return this.#board.getBoard();  
  }

  getMarkedNumbers() {
    return this.#board.getMarkedNumbers();
  }

  getStatus() {
    return this.#status;
  }

  setStatus(newStatus) {
    this.#status = newStatus;
    this.updatePlayerStatusInDB();
  }

  async updatePlayerStatusInDB() {
    const query = `
      UPDATE players
      SET status = '${this.#status}', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${this.#playerId};
    `;
    try {
      await dbQuery(query);
    } catch (error) {
      console.error('Error al actualizar el estado del jugador en la base de datos:', error);
    }
  }

  markNumber(num) {
    this.#board.markNumber(num);
  }

  hasWon() {
    return this.#board.isWinner(); 
  }
}
