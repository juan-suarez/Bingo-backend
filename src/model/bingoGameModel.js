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

  constructor() {
    this.#players = [];
    this.#calledNumbers = new Set();  
    this.#allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    this.#winner = null;
    this.#status = 'inactive';
  }

  addPlayer(userName) {
    if (this.#players.find(player => player.userName === userName)) {
      throw new Error('El jugador ya está en el juego');
    }

    const player = new Player(userName);
    this.#players.push(player);
    return player;
  }

  removePlayer(userName) {
    const playerIndex = this.#players.findIndex(player => player.getUserName() === userName);

    if (playerIndex === -1) {
      throw new Error('Jugador no encontrado en el juego');
    }

    this.#players.splice(playerIndex, 1);

    if (this.#winner && this.#winner.userName === userName) {
      this.#winner = null;
    }
  }

  start() {
    this.#calledNumbers.clear();
    this.#winner = null;
    this.#status = 'active';
    this.#players.forEach(player => player.setStatus('In game'));
  }

  getNextNumber() {
    const availableNumbers = this.#allNumbers.filter(num => !this.#calledNumbers.has(num));
    if (availableNumbers.length === 0) return null;
    const nextNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    this.#calledNumbers.add(nextNumber);
    return nextNumber;
  }

  finish() {
    this.#status = 'finished';
    this.#players.forEach(player => {
      if (player.getUserName() === this.#winner) {
        player.setStatus('Winner');
      } else {
        player.setStatus('Loser');
      }
    });
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
      this.#calledNumbers.has(board[0][0]) &&
      this.#calledNumbers.has(board[1][1]) &&
      this.#calledNumbers.has(board[3][3]) &&
      this.#calledNumbers.has(board[4][4]) ||
      this.#calledNumbers.has(board[0][4]) &&
      this.#calledNumbers.has(board[1][3]) &&
      this.#calledNumbers.has(board[3][1]) &&
      this.#calledNumbers.has(board[4][0])
    );
  }

  hasVertical(player) {
    const board = player.getBoard();
    for (let i = 0; i < 5; i++) {
      if (  
        this.#calledNumbers.has(board[0][i]) &&
        this.#calledNumbers.has(board[1][i]) &&
        (this.#calledNumbers.has(board[i][2] || i === 2)) &&
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

  isWinner(userName) {
    const player = this.getPlayer(userName);
    if (!player) {
      throw new Error('Jugador no encontrado en el juego');
    }

    if (
      this.hasCorners(player) || 
      this.hasDiagonal(player) || 
      this.hasHorizontal(player) ||
      this.hasVertical(player)
    ) {
      this.setWinner(userName);
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

  setWinner(userName) {
    this.#winner = userName;
  }
}
