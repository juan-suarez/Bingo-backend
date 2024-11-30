import { BingoBoard } from "./bingoBoardModel";

export class Player {
  #username;
  #board;

  constructor(username) {
    this.#username = username;
    this.#board = new BingoBoard();
  }

  getUsername() {
    return this.#username;
  }

  getBoard() {
    return this.#board.getBoard();  
  }

  getMarkedNumbers() {
    return this.#board.getMarkedNumbers();
  }

  markNumber(num) {
    this.#board.markNumber(num);
  }

  hasWon() {
    return this.#board.isWinner(); 
  }
}