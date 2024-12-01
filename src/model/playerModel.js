import { dbQuery } from "../db/db.js";
import { BingoBoard } from "./bingoBoardModel.js";

export const createPlayersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      status VARCHAR,
      board INTEGER[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

  constructor(username) {
    this.#username = username;
    this.#board = new BingoBoard();
    this.#status = "in lobby";
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

  getstatus() {
    return this.#status;
  }

  setStatus(newStatus){
    this.#status = newStatus;
  }

  markNumber(num) {
    this.#board.markNumber(num);
  }

  hasWon() {
    return this.#board.isWinner(); 
  }

}