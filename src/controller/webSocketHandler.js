import { Server } from 'socket.io';

export const handleWebSocket = (server) => {
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });
  io.on('connection', async (socket) => {
    console.log('user conected!')

    socket.on('disconnect', () => {
     
      console.log('user disconnected!');
    });
  });
};
