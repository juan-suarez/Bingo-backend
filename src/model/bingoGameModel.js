import { dbQuery } from "../db/db.js";
import { Player } from "./playerModel.js";

export const createBingoGameTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS bingo_game (
      id SERIAL PRIMARY KEY,
      winner VARCHAR,
      status VARCHAR,
      called_numbers INTEGER[],
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

export class BingoGame {
  #players;
  #calledNumbers;
  #allNumbers;
  #winner;
  #status;
  #id;

  constructor() {
    this.#players = [];
    this.#calledNumbers = new Set();
    this.#allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    this.#winner = null;
    this.#status = 'inactive';
    this.#id = null;

    this.createGameInDB();
  }

  async createGameInDB() {
    const query = `
      INSERT INTO bingo_game (status)
      VALUES ('${this.#status}')
      RETURNING id;
    `;
    try {
      const result = await dbQuery(query);
      this.#id = result.rows[0].id;
    } catch (error) {
      console.error('Error al crear el juego en la base de datos:', error);
    }
  }

  async updateGameInDB() {
    const query = `
      UPDATE bingo_game
      SET status = '${this.#status}', winner = '${this.#winner}', called_numbers = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${this.#id};
    `;
    await dbQuery(query, [Array.from(this.#calledNumbers)]);
  }

  async addPlayer(userName) {
    if (this.#players.find(player => player.userName === userName)) {
      throw new Error('El jugador ya está en el juego');
    }

    const player = new Player(userName, this.#id);
    this.#players.push(player);
    return player;
  }

  async removePlayer(userName) {
    const playerIndex = this.#players.findIndex(player => player.getUserName() === userName);

    if (playerIndex === -1) {
      return;
    }

    this.#players.splice(playerIndex, 1);

    if (this.#winner && this.#winner.userName === userName) {
      this.#winner = null;
    }
  }

  async start() {
    this.#calledNumbers.clear();
    this.#winner = null;
    this.#status = 'active';
    await this.updateGameInDB();
    this.#players.forEach(player => player.setStatus('In game'));
  }

  getNextNumber() {
    const availableNumbers = this.#allNumbers.filter(num => !this.#calledNumbers.has(num));
    if (availableNumbers.length === 0) return null;
    const nextNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    this.#calledNumbers.add(nextNumber);
    return nextNumber;
  }

  async finish() {
    this.#status = 'finished';
    console.log(this.#players)
    this.#players.forEach(player => {
      if (player.getUserName() === this.#winner) {
        player.setStatus('Winner');
      } else {
        player.setStatus('Loser');
      }
    });
    await this.updateGameInDB();
  }

  hasCorners(player) {
    const board = player.getBoard();
    return (
      this.#calledNumbers.has(board[0][0]) &&
      this.#calledNumbers.has(board[0][4]) &&
      this.#calledNumbers.has(board[4][0]) &&
      this.#calledNumbers.has(board[4][4])
    );
  }

  hasDiagonal(player) {
    const board = player.getBoard();
  
    return (
      (this.#calledNumbers.has(board[0][0]) &&
        this.#calledNumbers.has(board[1][1]) &&
        this.#calledNumbers.has(board[3][3]) &&
        this.#calledNumbers.has(board[4][4])) ||
      
      (this.#calledNumbers.has(board[0][4]) &&
        this.#calledNumbers.has(board[1][3]) &&
        this.#calledNumbers.has(board[3][1]) &&
        this.#calledNumbers.has(board[4][0]))
    );
  }

  hasVertical(player) {
    const board = player.getBoard();
    for (let i = 0; i < 5; i++) {
      if (
        this.#calledNumbers.has(board[0][i]) &&
        this.#calledNumbers.has(board[1][i]) &&
        (this.#calledNumbers.has(board[2][i] || i === 2)) &&
        this.#calledNumbers.has(board[3][i]) &&
        this.#calledNumbers.has(board[4][i])) {
        return true;
      }
    }
    return false;
  }

  hasHorizontal(player) {
    const board = player.getBoard();
    for (let i = 0; i < 5; i++) {
      if (
        this.#calledNumbers.has(board[i][0]) &&
        this.#calledNumbers.has(board[i][1]) &&
        (this.#calledNumbers.has(board[i][2] || i === 2)) &&
        this.#calledNumbers.has(board[i][3]) &&
        this.#calledNumbers.has(board[i][4])) {
          return true;
      }
    }
    return false;
  }

  async isWinner(userName) {
    const player = this.getPlayer(userName);
    if (!player) {
      return false;
    }
    // console.log(player.getBoard());
    // console.log(this.#calledNumbers);
    if (
      this.hasCorners(player) ||
      this.hasDiagonal(player) ||
      this.hasHorizontal(player) ||
      this.hasVertical(player)
    ) {
      this.setWinner(userName);
      await this.updateGameInDB();
      return true;
    }

    return false;
  }

  isActive() {
    return this.#status === 'active';
  }

  getCalledNumbers() {
    return this.#calledNumbers;
  }

  getPlayer(userName) {
    return this.#players.find(player => player.getUserName() === userName);
  }

  getPlayers() {
    return this.#players;
  }

  getWinner() {
    return this.#winner;
  }

  getStatus() {
    return this.#status;
  }

  setWinner(userName) {
    this.#winner = userName;
  }
}
