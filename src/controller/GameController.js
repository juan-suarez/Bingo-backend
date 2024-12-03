
export const startGame = (io, bingoGame) => {
  let timeToStart = 30;
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
      if (bingoGame.getStatus() === 'finished' ) {
        clearInterval(gameIntervalId);
        return;
      }
    }, 5000)
    return;
  }

};

export const bingo = async (io, bingoGame, userName) => {
  if(!(await bingoGame.isWinner(userName))){
    bingoGame.getPlayer(userName).setStatus('Disqualified');
    io.emit('player-disqualified', userName);
    return ;
  } else {
    io.emit('game-finished', userName);
    console.log(`${userName} is the winner`)
    bingoGame.setWinner(userName);
    bingoGame.finish();
  }

  return;
}
