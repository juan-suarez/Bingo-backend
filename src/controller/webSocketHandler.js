import { Server } from 'socket.io';
import { bingo, startGame } from './GameController.js';
import { BingoGame } from '../model/bingoGameModel.js';
import { getPlayersUserName } from '../utils/players.js';

export const handleWebSocket = (server) => {
  const bingoGame = new BingoGame();
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });
  io.on('connection', async (socket) => {
    const userName = socket.handshake.auth.username ;

    socket.on('add-player', () => {
      console.log(`${userName} in Game!`)
      bingoGame.addPlayer(userName);
      io.emit('connected-users', getPlayersUserName(bingoGame.getPlayers()));
      io.emit('started-game', bingoGame.isActive());
      io.emit('generate-table', bingoGame.getPlayer(userName).getBoard().flat())
    })

    socket.on('bingo', async () => {
      bingo(io, bingoGame, userName)
    });

    socket.on('start-game', async () => {
      startGame(io, bingoGame);
    });

    socket.on('remove-player', ()=> {
      console.log('player removed')
      if (bingoGame.getPlayers().length === 1) {

      if(bingoGame.getPlayers().length === 1){
        bingoGame.finish()
      }
      bingoGame.removePlayer(userName);
      io.emit('connected-users', getPlayersUserName(bingoGame.getPlayers()));
    });

    socket.on('disconnect', () => {
      console.log('user diconect')
      if(bingoGame.getPlayer(userName)){
        bingoGame.removePlayer(userName);
      }
    });
  });
};
