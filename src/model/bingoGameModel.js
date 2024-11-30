import { Player } from "./playerModel.js";

export class BingoGame {
  #players
  #calledNumbers
  #allNumbers
  #winner
  #status

  constructor() {
    this.#players = [];
    this.#calledNumbers = new Set();  
    this.#allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    this.#winner = null;
    this.#status = 'inactive'
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
    const playerIndex = this.#players.findIndex(player => player.userName === userName);

    if (playerIndex === -1) {
      throw new Error('Jugador no encontrado en el juego');
    }

    this.#players.splice(playerIndex, 1);

    if (this.#winner && this.#winner.userName === userName) {
      this.#winner = null;
    }
  }

  startGame() {
    this.#calledNumbers.clear();
    this.#winner = null;
    this.#status= 'active'
    this.#players.forEach(player => player.setStatus('In game'));
  }

  getNextNumber() {
    const availableNumbers = this.#allNumbers.filter(num => !this.#calledNumbers.has(num));
    if (availableNumbers.length === 0) return null;
    const nextNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    this.#calledNumbers.add(nextNumber);
    return nextNumber;
  }

  finishGame(){
    this.#status = 'finished';
    this.#players.forEach(player => {
      if(player.getUserName() === this.#winner){
        player.setStatus('Loser')
      }else{
        player.setStatus('Winner')
      }
    });
  }

  isActive(){
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
