class BingoGame {
  #players;

  constructor() {
    this.#players = [];
  }

  addPlayer(player) {
    this.#players.push(player);
  }

  getPlayers() {
    return this.#players;
  }

  static getGlobalUsedNumbers() {
    return BingoBoard.getUsedNumbers();
  }
}
