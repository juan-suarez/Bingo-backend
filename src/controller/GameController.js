
export const startGame = (io, bingoGame) => {
  let timeToStart = 10;
  bingoGame.start();

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

  console.log(bingoGame.getPlayers()[0]);
};

export const bingo = (io, bingoGame, userName) => {
  if(!bingoGame.isWinner(userName)){
    bingoGame.getPlayer(userName).setStatus('Disqualified');
    io.emit('user-disqualified', userName);
    return ;
  }

  io.emit('game-finished', true);

  bingoGame.setWinner(userName);
  bingoGame.finish();

  return;
}
