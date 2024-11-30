import { Server } from 'socket.io';
import { startGame } from './GameController.js';
import { BingoGame } from '../model/bingoGameModel.js';

export const handleWebSocket = (server) => {
  const bingoGame = new BingoGame();
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });
  io.on('connection', async (socket) => {
    const userName = socket.handshake.auth.username || socket.id;

    bingoGame.addPlayer(userName);
    io.emit('connected-users', bingoGame.getPlayers().length);
    io.emit('started-game',bingoGame.isActive());

    socket.on('bingo', async (message) => {
      bingoGame.setWinner(userName);
    });

    socket.on('start-game', async (message) => {
      startGame(socket, io, bingoGame);
    });

    socket.on('disconnect', () => {
      bingoGame.removePlayer(userName);
      io.emit('connected-users', bingoGame.getPlayers().length);
    });
  });
};
