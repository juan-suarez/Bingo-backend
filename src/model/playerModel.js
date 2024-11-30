import { BingoBoard } from "./bingoBoardModel.js";

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