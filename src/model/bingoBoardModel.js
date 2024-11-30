export class BingoBoard {
  #numbers;  
  #markedNumbers;  
  static #usedNumbers = new Set(); 

  constructor() {
    this.#numbers = this.generateBoard();
    this.#markedNumbers = [];
  }

  
  #generateBoard() {
    const columns = {
      B: { min: 1, max: 15, numbers: [] },
      I: { min: 16, max: 30, numbers: [] },
      N: { min: 31, max: 45, numbers: [] },
      G: { min: 46, max: 60, numbers: [] },
      O: { min: 61, max: 75, numbers: [] }
    };

    for (let letter in columns) {
      while (columns[letter].numbers.length < 5) {
        let num = this.#generateUniqueNumber(columns[letter].min, columns[letter].max);
        columns[letter].numbers.push(num);
      }
    }

    return [...columns.B.numbers, ...columns.I.numbers, ...columns.N.numbers, ...columns.G.numbers, ...columns.O.numbers];
  }

  #generateUniqueNumber(min, max) {
    let num;
    do {
      num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (BingoBoard.#usedNumbers.has(num));  
    BingoBoard.#usedNumbers.add(num);
    return num;
  }

  markNumber(num) {
    if (this.#numbers.includes(num) && !this.#markedNumbers.includes(num)) {
      this.#markedNumbers.push(num);
    }
  }

  getMarkedNumbers() {
    return this.#markedNumbers;
  }

  isWinner() {
    return this.#markedNumbers.length >= 5;
  }

  getBoard() {
    return this.#numbers;
  }

  static getUsedNumbers() {
    return BingoBoard.#usedNumbers;
  }
}
