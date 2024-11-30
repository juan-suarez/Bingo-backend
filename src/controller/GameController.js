
export const startGame = (socket, io, bingoGame, userName) => {
  let timeToStart = 10;
  bingoGame.startGame();

  const LobbyintervalId = setInterval(() => {
    io.emit('time-to-start', timeToStart);

    if (timeToStart === 0) {
      clearInterval(LobbyintervalId);
      startGameLoop();
      return;
    }

    timeToStart -= 1;
  }, 1000);


  function startGameLoop(){
    const gameIntervalId = setInterval(() => {
  
      const nextNumber = bingoGame.getNextNumber();
  
      if (nextNumber !== null) {
        io.emit('called-numbers', Array.from(bingoGame.getCalledNumbers()));
      } else {
        clearInterval(gameIntervalId);
        return;
      }
      if (bingoGame.getWinner()) {
        io.emit('someone-win',bingoGame.getWinner())
        clearInterval(gameIntervalId);
        return;
      }
    }, 5000)
    return;
  }

  console.log(bingo.getPlayers()[0]);
};


